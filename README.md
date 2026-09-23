# WeChat Article Designer

An Obsidian plugin that converts Markdown into **WeChat Official Account (公众号) compatible HTML**, previews the final style inside a phone frame, and copies it so you can paste it straight into the WeChat article editor.

> Personal (unverified) subscription accounts cannot pass WeChat certification, and the draft API returns `48001` for them. This plugin therefore uses a **"copy mode"** workflow: render locally → preview → copy → `Ctrl+V` in the WeChat backend. Zero setup, works on any account.
> (If an account later completes WeChat certification, an "API mode" that pushes to the draft box can be added.)

## Features

- Markdown → WeChat-compatible HTML (headings, quotes, lists, tables and code blocks all use inline styles, so nothing is lost when pasted)
- Syntax highlighting for code blocks (colors inlined, WeChat won't strip them)
- Supports Obsidian wikilink images `![[image.png]]`
- Local images are inlined as base64 automatically (can be disabled in settings)
- Phone-frame local preview of the final style
- One-click rich-text copy

## Installation

### Option 1: Manual install (available now)

1. Download `main.js`, `manifest.json` and `styles.css` from the [Releases](../../releases) page.
2. Put them into your vault at `.obsidian/plugins/wechat-designer/`.
3. In Obsidian, go to Settings → Community plugins → turn off Restricted mode → enable "WeChat Article Designer".

### Option 2: Community plugin marketplace (planned)

Once this plugin is accepted into the Obsidian community plugin directory, you can install it by searching for "WeChat Article Designer" in the plugin browser.

## Usage

1. Open any `.md` file.
2. Click the document icon in the left ribbon, or open the command palette (`Ctrl/Cmd+P`) and run "Preview and copy WeChat article".
3. In the modal, preview the style in the phone frame → click "Copy (WeChat format)" → switch to the WeChat article editor and press `Ctrl+V`.

## Document conventions

You can add the following frontmatter at the top of the document (defaults can also be set in the plugin settings):

```yaml
title: Article title
author: Author
digest: Summary
```

- What gets copied is the **body HTML** (title and summary are filled in separately in the WeChat backend). Paste and it looks exactly like the preview.
- Settings: default author, accent color, and whether to inline local images.

## Development

```bash
npm install
npm run build   # bundles to main.js
```

## License

MIT © moyansuyu

---

# 公众号图文设计器

Obsidian 插件：把 Markdown 一键转成**微信公众号兼容的 HTML**，本地手机预览样式，复制后直接粘贴到公众号后台编辑器。

> 个人订阅号无法做微信认证，草稿箱 API 对其返回 `48001`，所以本插件采用**「复制模式」**：本地生成样式 → 预览 → 复制 → 到公众号后台 `Ctrl+V`。零门槛，个人号立刻可用。
> （未来若账号完成微信认证，可扩展为「API 模式」一键推草稿箱。）

## 功能

- Markdown → 微信公众号兼容 HTML（标题 / 引用 / 列表 / 表格 / 代码高亮 全部内联样式，粘贴不丢格式）
- 代码块语法高亮（颜色内联，微信不剥离）
- 支持 Obsidian 双链图片 `![[图片]]` 语法
- 本地图片自动 base64 内联（设置里可关闭）
- 手机框本地预览最终样式
- 一键复制富文本

## 安装

### 方式一：手动安装（当前可用）

1. 在 [Releases](../../releases) 下载 `main.js`、`manifest.json`、`styles.css` 三个文件
2. 放到你的 vault 目录下：`.obsidian/plugins/wechat-designer/`
3. Obsidian → 设置 → 第三方插件 → 关闭安全模式 → 启用「WeChat Article Designer」

### 方式二：社区插件市场（规划中）

待提交至 Obsidian 社区插件仓库后，可直接在插件市场搜索「WeChat Article Designer」安装。

## 使用

1. 打开任意 `.md` 文档
2. 点击左侧栏文档图标，或命令面板（`Ctrl/Cmd+P`）搜索「预览并复制公众号图文」
3. 弹窗内手机框预览样式 → 点「复制（公众号格式）」→ 切换到公众号后台编辑器 `Ctrl+V`

## 文档约定

文档顶部 frontmatter 可写（也可在插件设置里设默认值）：

```yaml
title: 文章标题
author: 作者
digest: 摘要
```

- 复制的是**正文 HTML**（标题 / 摘要在公众号后台单独填），粘贴即可，所见即预览。
- 设置项：默认作者、主题强调色、是否内嵌本地图片。

## 开发

```bash
npm install
npm run build   # 打包到 main.js
```

## License

MIT © moyansuyu
