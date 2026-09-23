# WeChat Article Designer（公众号图文设计器）

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

待提交至 Obsidian 社区插件仓库后，可直接在插件市场搜索「公众号图文设计器」安装。

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
node esbuild.config.mjs   # 打包到 main.js
```

## License

MIT © moyansuyu
