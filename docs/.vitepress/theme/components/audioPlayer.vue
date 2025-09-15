<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

// --- Props ---
const props = defineProps({
  title: {
    type: String,
    default: 'Music'
  }
})

// --- State ---
const audio = ref(null)
const playing = ref(false)
const isSeeking = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isDark = ref(false)
const isDesktop = ref(true)

// --- 从 frontmatter 判断是否显示 ---
const { frontmatter } = useData()
const showPlayer = computed(() => frontmatter.value.floatingAudioPlayer !== false)

// --- 页面切换时重置状态 ---
const route = useRoute()
watch(
  () => route.path,
  () => {
    resetPlayer()
  }
)

const resetPlayer = () => {
  if (audio.value) {
    audio.value.pause()
    audio.value.currentTime = 0
  }
  playing.value = false
  currentTime.value = 0
}

// --- Time Formatting ---
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

// --- Dynamic Icon ---
const iconStyle = computed(() => {
  const iconName = playing.value ? 'pause' : 'play'
  const theme = isDark.value ? 'dark' : 'light'
  const iconUrl = `/icons/audioPlayer.${iconName}-${theme}.svg`
  return {
    'mask-image': `url(${iconUrl})`,
    '-webkit-mask-image': `url(${iconUrl})`,
  }
})

// --- Progress Bar ---
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const progressBarBackground = computed(() => {
  const progressColor = isDark.value ? '#298459' : '#30a46c'
  const trackColor = isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
  return {
    background: `linear-gradient(to right, ${progressColor} ${progressPercentage.value}%, ${trackColor} ${progressPercentage.value}%)`
  }
})

// --- Controls ---
const togglePlay = () => {
  if (!audio.value) return
  if (playing.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  playing.value = !playing.value
}

const onSeek = (e) => {
  const time = parseFloat(e.target.value)
  currentTime.value = time
}

const startSeek = () => { isSeeking.value = true }

const endSeek = (e) => {
  isSeeking.value = false
  const time = parseFloat(e.target.value)
  if (audio.value) {
    audio.value.currentTime = time
    if (playing.value) {
      audio.value.play()
    }
  }
}

// --- 拖拽功能 ---
const isDragging = ref(false)
const position = ref({ x: 0, y: 0 }) // 存储 transform 的偏移量
const dragStart = ref({ x: 0, y: 0 }) // 拖拽开始时鼠标的位置
const initialPosition = ref({ x: 0, y: 0 }) // 拖拽开始时组件的位置

const cardStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px)`
}))

const getEventCoords = (e) => (e.touches ? e.touches[0] : e)

const onDragStart = (e) => {
  // 不让拖拽进度条时移动整个组件
  if (e.target.classList.contains('progress-bar')) return
  
  isDragging.value = true
  const coords = getEventCoords(e)
  dragStart.value = { x: coords.clientX, y: coords.clientY }
  initialPosition.value = { ...position.value }
  
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragMove)
  window.addEventListener('touchend', onDragEnd)
}

const onDragMove = (e) => {
  if (!isDragging.value) return
  
  const coords = getEventCoords(e)
  const dx = coords.clientX - dragStart.value.x
  const dy = coords.clientY - dragStart.value.y
  
  position.value.x = initialPosition.value.x + dx
  position.value.y = initialPosition.value.y + dy
}

const onDragEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('touchend', onDragEnd)
}

// --- Lifecycle ---
let observer = null

const checkViewport = () => {
  isDesktop.value = window.innerWidth >= 960
}

onMounted(() => {
  if (audio.value) {
    const updateDuration = () => {
      if (audio.value) duration.value = audio.value.duration
    }
    if (audio.value.readyState >= 1) {
      updateDuration()
    } else {
      audio.value.addEventListener('loadedmetadata', updateDuration)
    }

    const onTimeUpdate = () => {
      if (!isSeeking.value) {
        currentTime.value = audio.value.currentTime
      }
    }
    const onEnded = () => {
      playing.value = false
      audio.value.currentTime = 0
    }
    audio.value.addEventListener('timeupdate', onTimeUpdate)
    audio.value.addEventListener('ended', onEnded)
  }

  const updateTheme = () => {
    isDark.value = document.documentElement.classList.contains('dark')
  }
  updateTheme()
  observer = new MutationObserver(updateTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  checkViewport()
  window.addEventListener('resize', checkViewport)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  window.removeEventListener('resize', checkViewport)
  // 清理可能残留的拖拽事件监听器
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('touchend', onDragEnd)
})
</script>

<template>
  <div 
    v-if="showPlayer && isDesktop" 
    class="audio-player-card"
    :class="{ 'is-dragging': isDragging }"
    :style="cardStyle"
    @mousedown.left="onDragStart"
    @touchstart.passive="onDragStart"
  >
    <!-- 为了更好的拖拽体验，将拖拽事件绑定在整个卡片上，但在样式中将标题设为拖拽手柄 -->
    <div class="song-title">{{ props.title }}</div>
    <div class="controls-row">
      <span class="time-display">{{ formattedCurrentTime }}</span>
      <button class="play-pause-btn" @click="togglePlay">
        <span class="icon" :style="iconStyle"></span>
      </button>
      <span class="time-display">{{ formattedDuration }}</span>
    </div>
    <div class="progress-bar-container">
      <input
        type="range"
        class="progress-bar"
        :value="currentTime"
        :max="duration || 1"
        :style="progressBarBackground"
        @input="onSeek"
        @mousedown="startSeek"
        @mouseup="endSeek"
        @touchstart.passive="startSeek"
        @touchend.passive="endSeek"
      />
    </div>
    <audio ref="audio" loop>
      <source src="./music/bgm.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<style scoped>
/* Main Card Container */
.audio-player-card {
  font-family: var(--vp-font-family-mono);
  font-feature-settings: var(--vp-font-feature-settings-mono);
  font-variant-ligatures: var(--vp-font-variant-ligatures-mono);
  position: fixed;
  bottom: 45px;
  right: 45px;
  z-index: 9999;
  width: 225px;
  padding: 10px 10px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
  /* 初始时 transform 为 0 */
  transform: translate(0, 0);
}

.dark .audio-player-card {
  background: rgba(40, 40, 40, 0.6);
  border-color: rgba(255, 255, 255, 0.15);
}

/* 拖拽时优化 */
.audio-player-card.is-dragging {
  /* 拖拽时移除 transition，避免延迟感 */
  transition: none;
  /* 增加阴影，有“浮起”的感觉 */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}


/* Top Row: Title - 作为拖拽手柄 */
.song-title {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 关键：将鼠标样式变为可拖拽状 */
  cursor: grab;
  /* 关键：防止拖拽时选中文字 */
  user-select: none;
  -webkit-user-select: none;
}
.dark .song-title {
  color: #ddd;
}
/* 当卡片被拖拽时，手柄鼠标样式变为“抓紧” */
.is-dragging .song-title {
  cursor: grabbing;
}

/* Middle Row: Controls Layout */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 4px;
  box-sizing: border-box;
}

.play-pause-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #111;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.dark .play-pause-btn {
  color: #eee;
}

.icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.time-display {
  font-size: 12px;
  color: #555;
  text-align: center;
}
.dark .time-display {
  color: #aaa;
}

/* Bottom Row: Progress Bar */
.progress-bar-container {
  height: 10px;
  display: flex;
  align-items: center;
  padding: 0 2px;
  box-sizing: border-box;
}

.progress-bar {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  margin-top: -1.1px; 
}
.dark .progress-bar::-webkit-slider-thumb {
  background: #222;
  border-color: rgba(255, 255, 255, 0.2);
}

.progress-bar::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.dark .progress-bar::-moz-range-thumb {
  background: #222;
  border-color: rgba(255, 255, 255, 0.2);
}
</style>