// 微信公众号排版主题：所有样式必须内联（微信会剥离 <style> 与 class）

// highlight.js token 类 -> 内联颜色（微信只保留内联 style）
export const HLJS_INLINE: Record<string, string> = {
  keyword: '#c0392b',
  string: '#2e7d32',
  number: '#1565c0',
  comment: '#8a8f98',
  title: '#6f42c1',
  attr: '#005cc5',
  built_in: '#e36209',
  literal: '#005cc5',
  type: '#6f42c1',
  tag: '#22863a',
  name: '#22863a',
  attribute: '#005cc5',
  meta: '#8a8f98',
  function: '#6f42c1',
  params: '#24292e',
  variable: '#e36209',
  property: '#005cc5',
  selector_tag: '#22863a',
  symbol: '#e36209',
  bullet: '#8a8f98',
  section: '#6f42c1',
  emphasis: '#24292e',
  strong: '#24292e',
  link: '#005cc5',
  regexp: '#e36209',
  class: '#6f42c1',
  default: '#24292e',
};

export function BASE_STYLE(): string {
  return (
    "font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;" +
    'color:#3f3f3f;font-size:15px;line-height:1.8;letter-spacing:.3px;word-break:break-word;'
  );
}
