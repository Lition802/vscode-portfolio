<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <p>资源管理器</p>
      <button class="close-sidebar-btn" @click="$emit('close-sidebar')">&times;</button>
    </div>
    <div class="file-explorer">
      <div v-for="folder in folderData" :key="folder.name" class="folder">
        <p @click="folder.open = !folder.open">
          <i :class="['fas', folder.open ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
          {{ folder.name }}
        </p>
        <ul v-show="folder.open">
          <li v-for="file in folder.files" :key="file.id" :class="['file', { active: file.id === activeFileId }]"
            @click="openFile(file)">
            <i :class="file.icon" :style="{ color: file.color }"></i> {{ file.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { folders } from '../config/sidebar.js';

defineProps({
  activeFileId: String,
});

const folderData = ref(folders);

const emit = defineEmits(['open-file', 'close-sidebar']);

const openFile = (file) => {
  emit('open-file', file);
};
</script>