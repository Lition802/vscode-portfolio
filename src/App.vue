<template>
  <div class="vscode-container">
    <ActivityBar :active-file-id="activeFileId" @navigate="handleNavigate"
      @toggle-sidebar="isSidebarOpenOnMobile = !isSidebarOpenOnMobile" />

    <Sidebar :class="{ open: isSidebarOpenOnMobile }" :active-file-id="activeFileId" @open-file="handleOpenFile"
      @close-sidebar="isSidebarOpenOnMobile = false" />

    <div class="main-layout">
      <MainContent :tabs="openTabs" :active-tab-id="activeFileId" :content-html="renderedHtml"
        @change-tab="setActiveFile" @close-tab="handleCloseTab" />

      <StatusBar />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 核心改動：導入我們自己的 Composable
import { useMarkdown } from './composables/useMarkdown.js';

// 導入組件及設定檔
import ActivityBar from './components/ActivityBar.vue';
import Sidebar from './components/Sidebar.vue';
import MainContent from './components/MainContent.vue';
import StatusBar from './components/StatusBar.vue';
import { folders } from './config/sidebar.js';


// --- 初始化 Markdown 功能 ---
// 呼叫 Composable，它會自動處理複製按鈕的事件監聽
const { parseMarkdown } = useMarkdown();


// --- 剩下的邏輯幾乎不變 ---
const markdownModules = import.meta.glob('./content/**/*.md', { eager: true, query: '?raw', import: 'default' });
const allFiles = computed(() => folders.flatMap(folder => folder.files));
const contentMap = allFiles.value.reduce((map, fileConfig) => {
  const pathKey = `./content/${fileConfig.markdownFile}`;
  if (markdownModules[pathKey] !== undefined) {
    map[fileConfig.id] = markdownModules[pathKey];
  } else {
    console.warn(`Markdown file not found for id '${fileConfig.id}': ${pathKey}`);
    map[fileConfig.id] = `錯誤：未找到 Markdown 檔案 "${fileConfig.markdownFile}"`;
  }
  return map;
}, {});

const activeFileId = ref('home');
const openTabs = ref([allFiles.value.find(f => f.id === 'home')]);
const isSidebarOpenOnMobile = ref(false);

const renderedHtml = computed(() => {
  const markdown = contentMap[activeFileId.value] || '內容未找到。';
  // 使用從 Composable 得到的函數來解析
  return parseMarkdown(markdown);
});

// --- 所有方法保持不變 ---
const setActiveFile = (fileId) => { activeFileId.value = fileId; };
const handleOpenFile = (file) => {
  if (!openTabs.value.some(tab => tab.id === file.id)) { openTabs.value.push(file); }
  setActiveFile(file.id);
};
const handleCloseTab = (fileId) => {
  const tabIndex = openTabs.value.findIndex(tab => tab.id === fileId);
  if (tabIndex === -1) return;
  openTabs.value.splice(tabIndex, 1);
  if (activeFileId.value === fileId) {
    const newActiveTab = openTabs.value[tabIndex - 1] || openTabs.value[0];
    activeFileId.value = newActiveTab ? newActiveTab.id : null;
  }
};
const handleNavigate = (fileId) => {
  const file = allFiles.value.find(f => f.id === fileId);
  if (file) { handleOpenFile(file); }
};
</script>