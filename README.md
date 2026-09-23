# WeChat Article Designer

An Obsidian plugin that converts Markdown into **WeChat Official Account compatible HTML**, previews the final style inside a phone frame, and copies it so you can paste it straight into the WeChat article editor.

> Personal (unverified) subscription accounts cannot pass WeChat certification, and the draft API returns `48001` for them. This plugin therefore uses a **"copy mode"** workflow: render locally → preview → copy → `Ctrl+V` in the WeChat backend. Zero setup, works on any account.
> (If an account later completes WeChat certification, an "API mode" that pushes to the draft box can be added.)

**中文说明见 [README.zh-CN.md](README.zh-CN.md).**

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

Releases are built from source in CI: pushing a tag triggers GitHub Actions, which builds the plugin, generates artifact attestations, and uploads `main.js`, `manifest.json` and `styles.css` to a new release.

## License

MIT © moyansuyu
