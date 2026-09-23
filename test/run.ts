import { convertToWechat } from '../src/converter';

const fakeApp: any = {
  vault: {
    getAbstractFileByPath: () => null,
    readBinary: async () => new Uint8Array([1, 2, 3]),
  },
};

const fakeFile: any = { basename: 'demo', parent: { path: '' }, extension: 'md', path: 'demo.md' };

const raw = `---
title: 示例文章
author: 墨言酥语
digest: 这是摘要
---

# 一级标题

这是一段正文，包含 **加粗**、*斜体* 与 [链接](https://example.com)。

> 这是引用块，用于强调。

## 二级标题

- 列表项一
- 列表项二

\`\`\`js
const a = 1;
function hello(name) {
  return "hi " + name;
}
\`\`\`

| 列1 | 列2 |
| --- | --- |
| a | b |

![](/abs/img.png)

![双链图片](note-embed.png)
`;

convertToWechat(fakeApp, fakeFile, raw, {
  defaultAuthor: '',
  accent: '#185fa5',
  embedImages: true,
})
  .then((a) => {
    console.log('TITLE:', a.title);
    console.log('AUTHOR:', a.author);
    console.log('DIGEST:', a.digest);
    console.log('--- HTML (head 600 chars) ---');
    console.log(a.html.slice(0, 600));
    console.log('--- checks ---');
    console.log('has <h1 style:', a.html.includes('<h1 style'));
    console.log('has hljs inline color:', /style="color:#/.test(a.html));
    console.log('has <table style:', a.html.includes('<table style'));
    console.log('img count:', (a.html.match(/<img/g) || []).length);
  })
  .catch((e) => {
    console.error('FAIL:', e);
    process.exit(1);
  });
