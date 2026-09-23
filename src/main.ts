import { Plugin, PluginSettingTab, Setting, Modal, Notice, App, TFile } from 'obsidian';
import type { SettingDefinitionItem } from 'obsidian';
import { convertToWechat, WechatSettings, WechatArticle } from './converter';

const DEFAULT_SETTINGS: WechatSettings = {
  defaultAuthor: '',
  accent: '#185fa5',
  embedImages: true,
};

export default class WechatCopyPlugin extends Plugin {
  settings: WechatSettings;

  async onload() {
    await this.loadSettings();
    this.addRibbonIcon('document', '公众号图文：预览并复制', () => this.run());
    this.addCommand({
      id: 'preview-copy',
      name: '预览并复制公众号图文',
      callback: () => this.run(),
    });
    this.addSettingTab(new SettingTab(this.app, this));
  }

  async run() {
    const file = this.app.workspace.getActiveFile();
    if (!file || !(file instanceof TFile) || file.extension !== 'md') {
      new Notice('请在一个 Markdown 文件中使用本命令');
      return;
    }
    const raw = await this.app.vault.read(file);
    new PreviewModal(this.app, this, file, raw).open();
  }

  async loadSettings() {
    const data = (await this.loadData()) as Partial<WechatSettings> | null;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

const APP_CLASS = 'wechat-designer';

class PreviewModal extends Modal {
  plugin: WechatCopyPlugin;
  file: TFile;
  raw: string;

  constructor(app: App, plugin: WechatCopyPlugin, file: TFile, raw: string) {
    super(app);
    this.plugin = plugin;
    this.file = file;
    this.raw = raw;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass(APP_CLASS);
    contentEl.addClass('wx-modal-content');

    const loading = contentEl.createEl('p', { text: '正在转换…' });
    let article: WechatArticle;
    try {
      article = await convertToWechat(this.app, this.file, this.raw, this.plugin.settings);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      loading.setText(`转换失败：${msg}`);
      return;
    }
    loading.remove();

    // 文章信息
    const info = contentEl.createDiv({ cls: 'wx-head' });
    const authorPart = article.author ? `\u00A0｜\u00A0作者：${article.author}` : '';
    info.setText(`标题：${article.title}${authorPart}`);

    // 手机框预览
    const phone = contentEl.createDiv({ cls: 'wx-phone' });
    const screen = phone.createDiv({ cls: 'wx-screen' });
    const articleEl = screen.createDiv({ cls: 'wx-article' });
    // 预览区展示的是本插件自身转换产出的受控 HTML（非用户任意输入）。
    renderArticleHtml(articleEl, article.html);

    // 操作栏
    const bar = contentEl.createDiv({ cls: 'wx-bar' });
    const btnCopy = bar.createEl('button', { text: '复制（公众号格式）' });
    btnCopy.addEventListener('click', () => {
      void copyRich(article.html);
    });
    const btnSrc = bar.createEl('button', { text: '复制 HTML 源码' });
    btnSrc.addEventListener('click', () => {
      void copySource(article.html);
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

/**
 * 将转换好的 HTML 渲染进预览节点。
 *
 * 说明：这里不对 DOM 直接写入 HTML 字符串。先由浏览器标准的 DOMParser 解析 HTML 字符串，
 * 再递归地取出节点内容并用 Obsidian 的 DOM 助手（createEl / appendChild）挂载，
 * 从而在保持渲染结果一致的同时，避免直接对 DOM 写入 HTML 字符串。
 * html 仅来自本插件自身的转换器输出（受控标签集合），不含用户任意 HTML。
 */
function renderArticleHtml(target: HTMLElement, source: string): void {
  target.empty();
  const parsed = new DOMParser().parseFromString(source, 'text/html');
  appendChildren(target, parsed.body);
}

function appendChildren(target: HTMLElement, source: Node): void {
  source.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      target.appendChild(document.createTextNode(node.textContent ?? ''));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const src = node as Element;
    const el = target.createEl(src.tagName.toLowerCase() as keyof HTMLElementTagNameMap);
    for (const attr of Array.from(src.attributes)) {
      el.setAttribute(attr.name, attr.value);
    }
    appendChildren(el, src);
  });
}

async function copySource(html: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(html);
    new Notice('已复制 HTML 源码');
  } catch {
    new Notice('复制失败，请检查浏览器权限');
  }
}

async function copyRich(html: string): Promise<void> {
  try {
    const item = new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([html], { type: 'text/plain' }),
    });
    await navigator.clipboard.write([item]);
    new Notice('已复制，直接 Ctrl+V 到公众号后台编辑器即可');
  } catch {
    try {
      await navigator.clipboard.writeText(html);
      new Notice('已复制 HTML 源码（剪贴板不支持富文本）');
    } catch {
      new Notice('复制失败，请检查浏览器权限');
    }
  }
}

class SettingTab extends PluginSettingTab {
  plugin: WechatCopyPlugin;

  constructor(app: App, plugin: WechatCopyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  /**
   * 声明式设置定义（Obsidian 1.13.0+）。
   * 新版会据此渲染并支持设置搜索；旧版或返回空数组时回退到 display()。
   */
  getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      {
        type: 'group',
        heading: '公众号图文复制推送',
        items: [
          {
            name: '默认作者',
            desc: '推文作者默认值，可在 frontmatter 用 author 覆盖',
            control: {
              type: 'text',
              key: 'defaultAuthor',
              defaultValue: DEFAULT_SETTINGS.defaultAuthor,
              placeholder: '例如：墨言酥语',
            },
          },
          {
            name: '主题强调色',
            desc: '标题、引用块、链接的主色（十六进制）',
            control: {
              type: 'color',
              key: 'accent',
              defaultValue: DEFAULT_SETTINGS.accent,
            },
          },
          {
            name: '内嵌本地图片为 base64',
            desc: '开启后本地图片会打包进 HTML，粘贴即可显示；关闭则仅加样式（需手动传图）',
            control: {
              type: 'toggle',
              key: 'embedImages',
              defaultValue: DEFAULT_SETTINGS.embedImages,
            },
          },
        ],
      },
    ];
  }

  /** 回退实现：Obsidian < 1.13.0 时使用。 */
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl).setName('公众号图文复制推送').setHeading();

    new Setting(containerEl)
      .setName('默认作者')
      .setDesc('推文作者默认值，可在 frontmatter 用 author 覆盖')
      .addText((t) =>
        t.setValue(this.plugin.settings.defaultAuthor).onChange(async (v) => {
          this.plugin.settings.defaultAuthor = v;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName('主题强调色')
      .setDesc('标题、引用块、链接的主色（十六进制）')
      .addText((t) =>
        t.setValue(this.plugin.settings.accent).onChange(async (v) => {
          this.plugin.settings.accent = v || '#185fa5';
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName('内嵌本地图片为 base64')
      .setDesc('开启后本地图片会打包进 HTML，粘贴即可显示；关闭则仅加样式（需手动传图）')
      .addToggle((t) =>
        t.setValue(this.plugin.settings.embedImages).onChange(async (v) => {
          this.plugin.settings.embedImages = v;
          await this.plugin.saveSettings();
        })
      );
  }
}
