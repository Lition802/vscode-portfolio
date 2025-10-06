<template>
    <div class="bili-card">
        <div v-if="loading" class="card-placeholder">
            <div class="spinner"></div>
            <p>載入Bilibili影片資訊中...</p>
        </div>

        <div v-else-if="error" class="card-error">
            <p>無法載入影片資訊：</p>
            <p class="error-message">{{ error }}</p>
        </div>

        <div v-else-if="videoInfo" class="card-content">
            <div class="cover-container">
                <img :src="proxiedImageUrl" :alt="videoInfo.title" class="cover-image" />
                <div class="cover-overlay">
                    <button @click="togglePlayer" class="play-button">
                        <i :class="showPlayer ? 'fas fa-times' : 'fas fa-play'"></i>
                    </button>
                </div>
            </div>
            <div class="info-container">
                <h3 class="video-title" :title="videoInfo.title">{{ videoInfo.title }}</h3>
                <p class="uploader-info">
                    <i class="fas fa-user-edit"></i> {{ videoInfo.owner.name }}
                </p>
                <div class="stats-info">
                    <span><i class="fas fa-play-circle"></i> {{ formatNumber(videoInfo.stat.view) }}</span>
                    <span><i class="fas fa-thumbs-up"></i> {{ formatNumber(videoInfo.stat.like) }}</span>
                </div>
            </div>
        </div>

        <div v-if="showPlayer" class="player-container">
            <iframe :src="`//player.bilibili.com/player.html?bvid=${bvid}&page=1&as_wide=1&high_quality=1&danmaku=0`"
                scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true">
            </iframe>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const props = defineProps({
    bvid: {
        type: String,
        required: true,
    },
});

// 組件狀態
const videoInfo = ref(null);
const loading = ref(true);
const error = ref(null);
const showPlayer = ref(false);

// 解決 Bilibili 圖片防盜鏈問題的代理 URL
const proxiedImageUrl = computed(() => {
    if (videoInfo.value && videoInfo.value.pic) {
        // 使用一個免費的圖片代理服務來繞過防盜鏈
        return `https://images.weserv.nl/?url=${videoInfo.value.pic.replace(/^https?:\/\//, '')}`;
    }
    return '';
});

// 格式化數字 (例如 10000 -> 1萬)
function formatNumber(num) {
    if (num > 10000) {
        return `${(num / 10000).toFixed(1)}萬`;
    }
    return num.toString();
}

// 切換播放器的顯示狀態
function togglePlayer() {
    showPlayer.value = !showPlayer.value;
}

// 獲取影片資訊的異步函數
async function fetchVideoInfo() {
    loading.value = true;
    error.value = null;
    videoInfo.value = null;
    showPlayer.value = false;

    // Bilibili API URL
    const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${props.bvid}`;
    // 使用 CORS 代理來解決跨域問題
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`網路錯誤，狀態碼: ${response.status}`);
        }
        const data = await response.json();

        if (data.code === 0) {
            videoInfo.value = data.data;
        } else {
            throw new Error(data.message || '無法從Bilibili API獲取資料');
        }
    } catch (err) {
        console.error('獲取Bilibili影片資訊時出錯:', err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
}

// 當組件掛載時執行獲取
onMounted(fetchVideoInfo);

// 當 bvid prop 變化時，重新獲取
watch(() => props.bvid, fetchVideoInfo);
</script>

<style scoped>
.bili-card {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    border: 1px solid #3e3e42;
    border-radius: 8px;
    overflow: hidden;
    background-color: #252526;
    color: #cccccc;
    max-width: 350px;
    margin: 1em;
    transition: all 0.3s ease;
}

.bili-card:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
}

.card-placeholder,
.card-error {
    padding: 20px;
    text-align: center;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.error-message {
    font-size: 0.9em;
    color: #ff5252;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-left-color: #00a1d6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.cover-container {
    position: relative;
    width: 100%;
    padding-top: 62.5%;
    /* 16:10 比例 */
    background-color: #333;
}

.cover-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.bili-card:hover .cover-overlay {
    opacity: 1;
}

.play-button {
    background-color: rgba(0, 161, 214, 0.8);
    border: none;
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
}

.play-button:hover {
    background-color: #00a1d6;
    transform: scale(1.1);
}

.info-container {
    padding: 15px;
}

.video-title {
    font-size: 1.1em;
    font-weight: 600;
    margin: 0 0 10px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.uploader-info {
    font-size: 0.9em;
    color: #888;
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
}

.uploader-info i {
    margin-right: 8px;
}

.stats-info {
    display: flex;
    gap: 15px;
    font-size: 0.9em;
    color: #888;
}

.stats-info span {
    display: flex;
    align-items: center;
}

.stats-info i {
    margin-right: 5px;
}

.player-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    /* 保持16:9的寬高比 */
}

.player-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>