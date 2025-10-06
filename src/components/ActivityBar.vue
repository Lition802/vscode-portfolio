<template>
    <div class="activity-bar">
        <div class="action-button hamburger-menu" @click="$emit('toggle-sidebar')">
            <i class="fas fa-bars"></i>
        </div>

        <div :class="['action-button', 'explorer-icon', { active: activeFileId === 'home' }]"
            @click="$emit('navigate', 'home')">
            <i class="fas fa-folder"></i>
        </div>

        <div :class="['action-button', { active: activeFileId === 'about' }]" @click="$emit('navigate', 'about')">
            <i class="fas fa-user"></i>
        </div>
        <div :class="['action-button', { active: activeFileId === 'projects' }]" @click="$emit('navigate', 'projects')">
            <i class="fas fa-briefcase"></i>
        </div>
        <div :class="['action-button', { active: activeFileId === 'skills' }]" @click="$emit('navigate', 'skills')">
            <i class="fas fa-cogs"></i>
        </div>
        <div :class="['action-button', { active: activeFileId === 'contact' }]" @click="$emit('navigate', 'contact')">
            <i class="fas fa-envelope"></i>
        </div>
    </div>
</template>

<script setup>
defineProps({
    activeFileId: String,
});

defineEmits(['navigate', 'toggle-sidebar']);
</script>

<style scoped>
/* --- ActivityBar 专属样式 (最终修正版) --- */

.activity-bar {
    background-color: var(--activity-bar-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 15px;
    grid-column: 1 / 2;
}

.action-button {
    font-size: 24px;
    color: var(--text-color);
    /* margin-bottom: 25px; */
    cursor: pointer;
    position: relative;

    /* 统一布局方式 */
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-button.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--accent-color);
}

/* 默认隐藏移动端汉堡菜单 */
.hamburger-menu {
    display: none;
}

/* 修正：不再需要 display: block，它会继承 .action-button 的 display: flex */
.explorer-icon {
    /* 此处为空，默认显示 */
}


/* 移动端响应式样式 */
@media (max-width: 768px) {
    .activity-bar {
        order: 2;
        width: 100%;
        height: 50px;
        padding-top: 0;
        border-top: 1px solid var(--border-color);
        z-index: 500;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .action-button {
        margin-bottom: 0;
    }

    .action-button.active::before {
        top: 0;
        bottom: auto;
        /* 重置桌面端的 bottom */
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 2px;
    }

    /* 修正：显示时使用 display: flex，与其它按钮保持一致 */
    .hamburger-menu {
        display: flex;
    }

    .explorer-icon {
        display: none;
    }
}
</style>