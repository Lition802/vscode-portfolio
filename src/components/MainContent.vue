<template>
    <div class="main-content-wrapper">
        <div class="editor-tabs">
            <div v-for="tab in tabs" :key="tab.id" :class="['tab', { active: tab.id === activeTabId }]"
                @click="$emit('change-tab', tab.id)">
                <i :class="tab.icon" :style="{ color: tab.color }"></i> {{ tab.name }}
                <span class="close-tab" @click.stop="$emit('close-tab', tab.id)">&times;</span>
            </div>
        </div>

        <div class="editor-content" v-html="contentHtml"></div>

    </div>
</template>

<script setup>
defineProps({
    tabs: Array,
    activeTabId: String,
    contentHtml: String, // 新增一个 prop 来接收 HTML
});

defineEmits(['change-tab', 'close-tab']);
</script>

<style scoped>
.main-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
}

/* --- 新的代码块样式 --- */

/* 1. 基础样式和链接 */
.editor-content :deep(h1),
.editor-content :deep(h2),
.editor-content :deep(h3) {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.3em;
}

.editor-content :deep(a) {
    color: var(--accent-color);
    text-decoration: none;
}

.editor-content :deep(a:hover) {
    text-decoration: underline;
}

.editor-content :deep(hr) {
    border: 0;
    border-top: 1px solid var(--border-color);
    margin: 1em 0;
}

/* 2. 行内代码 `code` */
.editor-content :deep(code) {
    background-color: #3e3e42;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}

/* 3. 代码块容器 */
.editor-content :deep(.code-block-container) {
    margin: 1.5em 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    background-color: #2d2d2d;
    /* 容器背景色，比编辑器略深 */
}

/* 4. 代码块头部 (语言 + 复制按钮) */
.editor-content :deep(.code-block-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #3c3c3c;
    padding: 0.5em 1em;
    color: #ccc;
    font-size: 0.85em;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}

.editor-content :deep(.copy-btn) {
    background: none;
    border: 1px solid transparent;
    color: #ccc;
    cursor: pointer;
    padding: 0.3em 0.6em;
    border-radius: 5px;
    transition: all 0.2s ease;
    font-size: 1em;
}

.editor-content :deep(.copy-btn:hover) {
    background-color: #4f4f4f;
    border-color: var(--border-color);
}

.editor-content :deep(.copy-btn:disabled) {
    color: #00cc66;
    /* 复制成功后的颜色 */
    cursor: default;
}

/* 5. <pre> 和 <code> 标签重置 */
.editor-content :deep(pre) {
    margin: 0;
    padding: 1em;
    padding-left: 3.8em;
    /* 为行号留出空间 */
    overflow-x: auto;
    position: relative;
    counter-reset: line;
    /* 初始化行号计数器 */
}

.editor-content :deep(pre code) {
    background-color: transparent;
    padding: 0;
}

/* 6. 行号实现 */
.editor-content :deep(pre.line-numbers code .hljs-ln-line::before) {
    content: counter(line);
    counter-increment: line;
    position: absolute;
    left: 0;
    width: 2.5em;
    /* 行号区域宽度 */
    text-align: right;
    padding-right: 1em;
    color: #6c6c6c;
    /* 行号颜色 */
    -webkit-user-select: none;
    user-select: none;
}

/* 7. 自定义滚动条 */
.editor-content :deep(pre::-webkit-scrollbar) {
    height: 8px;
}

.editor-content :deep(pre::-webkit-scrollbar-track) {
    background: #2d2d2d;
}

.editor-content :deep(pre::-webkit-scrollbar-thumb) {
    background: #555;
    border-radius: 4px;
}

.editor-content :deep(pre::-webkit-scrollbar-thumb:hover) {
    background: #666;
}
</style>