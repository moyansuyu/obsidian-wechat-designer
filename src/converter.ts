import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import sql from 'highlight.js/lib/languages/sql';
import { App, TFile, TAbstractFile } from 'obsidian';

// 轻量 frontmatter 解析：避免引入 gray-matter 带来的 fs / eval / new Function，过 Obsidian 安全评分卡
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, content: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (kv) {
      let v = kv[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      data[kv[1]] = v;
    }
  }
  return { data, content: raw.slice(m[0].length) };
}

import markdown from 'highlight.js/lib/languages/markdown';
import yaml from 'highlight.js/lib/languages/yaml';
import { HLJS_INLINE, BASE_STYLE } from './theme';

// 只注册常用语言，显著减小打包体积（全量 highlight.js 约 1.8MB）
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('java', java);
hljs.registerLanguage('go', go);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);

export interface WechatSettings {
  defaultAuthor: string;
  accent: string;
  embedImages: boolean;
}

export interface WechatArticle {
  title: string;
  author: string;
  digest: string;
  html: string;
}

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

// 代码块：高亮 + 内联颜色 + 卡片化容器
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx];
  const info = token.info ? token.info.trim() : '';
  let inner: string;
  try {
    inner =
      info && hljs.getLanguage(info)
        ? hljs.highlight(token.content, { language: info }).value
        : hljs.highlightAuto(token.content).value;
  } catch {
    inner = md.utils.escapeHtml(token.content);
  }
  // 把 hljs class 转成内联 color（微信只保留内联 style）
  inner = inner.replace(/class="hljs-([a-z0-9_-]+)"/g, (_m, c: string) => {
    const col = HLJS_INLINE[c] || HLJS_INLINE.default;
    return `style="color:${col}"`;
  });
  return (
    '<section style="background:#f6f8fa;border:1px solid #e1e4e8;border-radius:6px;' +
    'padding:12px 14px;margin:16px 0;overflow-x:auto;">' +
    '<code style="font-family:Consolas,Menlo,monospace;font-size:13px;line-height:1.7;' +
    `color:#24292e;white-space:pre;">${inner}</code></section>`
  );
};

// 给基础标签注入微信兼容的内联样式
function applyTheme(html: string, accent: string): string {
  const s = {
    h1: 'font-size:20px;font-weight:700;color:#222;margin:20px 0 12px;',
    h2: `font-size:18px;font-weight:600;color:${accent};border-left:4px solid ${accent};padding-left:10px;margin:22px 0 12px;`,
    h3: 'font-size:16px;font-weight:600;color:#333;margin:18px 0 10px;',
    p: 'font-size:15px;line-height:1.8;color:#3f3f3f;margin:12px 0;letter-spacing:.3px;',
    blockquote: `margin:14px 0;padding:10px 14px;background:#f3f6fb;border-left:4px solid ${accent};color:#5b6b7b;font-size:14px;line-height:1.7;`,
    ul: 'padding-left:22px;margin:12px 0;',
    ol: 'padding-left:22px;margin:12px 0;',
    li: 'font-size:15px;line-height:1.8;color:#3f3f3f;margin:4px 0;',
    a: `color:${accent};text-decoration:none;`,
    hr: 'border:none;border-top:1px solid #e1e4e8;margin:20px 0;',
    strong: 'font-weight:600;color:#222;',
    em: 'font-style:italic;color:#555;',
    code: 'background:#f0f2f5;color:#c0392b;padding:2px 6px;border-radius:4px;font-family:Consolas,Menlo,monospace;font-size:13px;',
    table: 'border-collapse:collapse;width:100%;margin:14px 0;font-size:14px;',
    th: 'border:1px solid #e1e4e8;padding:8px 10px;background:#f3f6fb;color:#333;font-weight:600;',
    td: 'border:1px solid #e1e4e8;padding:8px 10px;color:#3f3f3f;',
  };
  let out = html;
  out = out.replace(/<h1>/g, `<h1 style="${s.h1}">`);
  out = out.replace(/<h2>/g, `<h2 style="${s.h2}">`);
  out = out.replace(/<h3>/g, `<h3 style="${s.h3}">`);
  out = out.replace(/<p>/g, `<p style="${s.p}">`);
  out = out.replace(/<blockquote>/g, `<blockquote style="${s.blockquote}">`);
  out = out.replace(/<ul>/g, `<ul style="${s.ul}">`);
  out = out.replace(/<ol>/g, `<ol style="${s.ol}">`);
  out = out.replace(/<li>/g, `<li style="${s.li}">`);
  out = out.replace(/<a /g, `<a style="${s.a}" `);
  out = out.replace(/<hr>/g, `<hr style="${s.hr}">`);
  out = out.replace(/<strong>/g, `<strong style="${s.strong}">`);
  out = out.replace(/<em>/g, `<em style="${s.em}">`);
  out = out.replace(/<code>/g, `<code style="${s.code}">`);
  out = out.replace(/<table>/g, `<table style="${s.table}">`);
  out = out.replace(/<th>/g, `<th style="${s.th}">`);
  out = out.replace(/<td>/g, `<td style="${s.td}">`);
  return out;
}

function ensureImgStyle(tag: string): string {
  if (/style="/.test(tag)) return tag;
  return tag.replace(
    /<img /,
    '<img style="max-width:100%;height:auto;display:block;margin:8px auto;" '
  );
}

const MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
};

function bufToBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk) as any);
  }
  return btoa(bin);
}

async function resolveImage(app: App, file: TFile, src: string): Promise<TFile | null> {
  if (src.startsWith('/')) {
    const af = app.vault.getAbstractFileByPath(src.replace(/^\//, ''));
    return af instanceof TFile ? af : null;
  }
  const folder = file.parent ? file.parent.path : '';
  const p = folder ? `${folder}/${src}` : src;
  const af = app.vault.getAbstractFileByPath(p);
  return af instanceof TFile ? af : null;
}

async function inlineLocalImages(app: App, file: TFile, html: string, embed: boolean): Promise<string> {
  if (!embed) {
    // 不内嵌：仅保证图片有 max-width 样式
    return html.replace(/<img\b([^>]*?)>/g, (_m, attrs) => ensureImgStyle(`<img${attrs}>`));
  }
  const imgRe = /<img\b([^>]*?)>/g;
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = imgRe.exec(html))) {
    const tag = m[0];
    out += html.slice(last, m.index);
    last = m.index + tag.length;
    const srcMatch = tag.match(/src="([^"]+)"/);
    if (srcMatch) {
      const src = srcMatch[1];
      if (!/^(https?:|data:)/.test(src)) {
        const af = await resolveImage(app, file, src);
        if (af) {
          try {
            const buf = await app.vault.readBinary(af.path);
            const ext = (af.extension || 'png').toLowerCase();
            const mime = MIME[ext] || 'image/png';
            const dataUri = `data:${mime};base64,${bufToBase64(buf)}`;
            out += ensureImgStyle(tag.replace(/src="[^"]+"/, `src="${dataUri}"`));
            continue;
          } catch {
            /* 读取失败则保留原图 */
          }
        }
      }
    }
    out += ensureImgStyle(tag);
  }
  out += html.slice(last);
  return out;
}

export async function convertToWechat(
  app: App,
  file: TFile,
  raw: string,
  settings: WechatSettings
): Promise<WechatArticle> {
  const { data, content } = parseFrontmatter(raw);
  // 支持 Obsidian 双链图片 ![[img.png]] / ![[img.png|200]] -> 标准 ![...](...)
  const normalized = content.replace(
    /!\[\[([^\]\|]+)(?:\|[^\]]*)?\]\]/g,
    (_m, name: string) => `![](${name.trim()})`
  );
  let html = md.render(normalized);
  html = applyTheme(html, settings.accent);
  html = await inlineLocalImages(app, file, html, settings.embedImages);
  const wrapped = `<section style="${BASE_STYLE()}">${html}</section>`;
  return {
    title: (data && data.title) || file.basename,
    author: (data && data.author) || settings.defaultAuthor || '',
    digest: (data && data.digest) || '',
    html: wrapped,
  };
}
