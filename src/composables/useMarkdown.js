// src/composables/useMarkdown.js

import { onMounted, onBeforeUnmount } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import go from 'highlight.js/lib/languages/go';
import css from 'highlight.js/lib/languages/css';
import markdown from 'highlight.js/lib/languages/markdown';
import shell from 'highlight.js/lib/languages/shell';
import plaintext from 'highlight.js/lib/languages/plaintext';

// --- 一次性設定 ---
// 這部分程式碼在模組被導入時只會執行一次，效率很高

// 1. 註冊語言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('go', go);
hljs.registerLanguage('golang', go);
hljs.registerLanguage('css', css);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('sh', shell);
hljs.registerLanguage('plaintext', plaintext);

// 2. 設定 Marked
const renderer = new marked.Renderer();
renderer.code = (code) => {
    const validCode = code.text;
    const language = code.lang ? code.lang : 'plaintext';
    const highlightedCode = hljs.highlight(validCode, { language: code.lang, ignoreIllegals: true }).value;

    return `
    <div class="code-block-container">
      <div class="code-block-header">
        <span class="language-name">${language}</span>
        <button class="copy-btn">
          <i class="far fa-copy"></i> Copy
        </button>
      </div>
      <pre class="line-numbers"><code class="hljs language-${language}">${highlightedCode}</code></pre>
    </div>
  `;
};

marked.setOptions({
    renderer: renderer,
});


// --- Composable 函數 ---
// 這是一個可導出的函數，其他組件可以調用它來獲取 Markdown 功能
export function useMarkdown() {

    // 3. 處理複製按鈕的點擊事件
    const handleCopyClick = (event) => {
        const target = event.target.closest('.copy-btn');
        if (!target) return;
        const container = target.closest('.code-block-container');
        const codeElement = container.querySelector('code');
        if (codeElement) {
            navigator.clipboard.writeText(codeElement.innerText).then(() => {
                target.innerHTML = '<i class="fas fa-check"></i> Copied!';
                target.disabled = true;
                setTimeout(() => {
                    target.innerHTML = '<i class="far fa-copy"></i> Copy';
                    target.disabled = false;
                }, 2000);
            });
        }
    };

    // 4. 管理事件監聽的生命週期
    onMounted(() => {
        document.addEventListener('click', handleCopyClick);
    });
    onBeforeUnmount(() => {
        document.removeEventListener('click', handleCopyClick);
    });

    // 5. 返回解析函數
    return {
        parseMarkdown: (markdownText) => marked.parse(markdownText)
    };
}