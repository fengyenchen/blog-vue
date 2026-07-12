import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import markedKatex from 'marked-katex-extension'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  }),
  markedKatex({
    // 公式有錯誤時顯示原始內容，而非中斷整篇文章的渲染。
    throwOnError: false,
  }),
)

export const parseMarkdown = (content: string | null | undefined) => {
    return marked.parse(content || '')
}
