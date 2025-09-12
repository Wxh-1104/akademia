<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress' // <- 用来读取当前页面的 frontmatter

// --- Props ---
const props = defineProps({
  title: {
    type: String,
    default: 'Background Music'
  }
})

// --- Read frontmatter to decide whether to show the player ---
// floatingAudioPlayer 在页面 frontmatter 中设置为 false 时隐藏，未设置或为 true 时显示
const { frontmatter } = useData()
const showPlayer = computed(() => frontmatter?.value?.floatingAudioPlayer !== false)

// --- State ---
const audio = ref(null)
const playing = ref(false)
const isSeeking = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isDark = ref(false)

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

// --- Progress Bar Style ---
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const progressBarBackground = computed(() => {
  const progressColor = isDark.value ? '#298459' : '#30a46c';
  const trackColor = isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  
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
  const time = parseFloat(e.target.value);
  
  // *** THIS IS THE FIX ***
  // Manually update currentTime ref for immediate visual feedback on the progress bar.
  currentTime.value = time;

  if (audio.value) {
    audio.value.currentTime = time;
  }
}

const startSeek = () => { isSeeking.value = true }
const endSeek = (e) => {
  isSeeking.value = false
  // For paused state, we need to ensure the final position is set correctly.
  if (audio.value && audio.value.paused) {
    onSeek(e)
  }
}

// --- Lifecycle & Theme Detection ---
let observer = null

onMounted(() => {
  if (audio.value) {
    // --- THIS IS THE FIX ---
    // A robust function to update duration
    const updateDuration = () => {
      if (audio.value) {
        duration.value = audio.value.duration
      }
    }

    // Check if metadata is already loaded.
    // readyState >= 1 means metadata is available.
    if (audio.value.readyState >= 1) {
      updateDuration()
    } else {
      // If not, wait for the event.
      audio.value.addEventListener('loadedmetadata', updateDuration)
    }
    // --- END OF FIX ---

    // The rest of the event listeners remain the same
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

  const updateTheme = () => { isDark.value = document.documentElement.classList.contains('dark') }
  updateTheme()

  observer = new MutationObserver(updateTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <!-- 仅当 frontmatter 中 floatingAudioPlayer 未被显式设置为 false 时显示 -->
  <div v-if="showPlayer" class="audio-player-card">
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
      <source src="/music/bgm.mp3" type="audio/mpeg" />
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
  gap: 0; /* MODIFIED: Reduced distance between rows */
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, border-color 0.3s;
}

.dark .audio-player-card {
  background: rgba(40, 40, 40, 0.6);
  border-color: rgba(255, 255, 255, 0.15);
}

/* Top Row: Title */
.song-title {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dark .song-title {
  color: #ddd;
}

/* Middle Row: Controls Layout */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 4px; /* MODIFIED: Move time displays slightly inwards */
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
  text-align: center; /* Center the text inside its box */
}
.dark .time-display {
  color: #aaa;
}

/* Bottom Row: Progress Bar */
.progress-bar-container {
  height: 10px;
  display: flex;
  align-items: center;
  padding: 0 2px; /* MODIFIED: Align with the controls row */
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

/* Thumb (slider handle) styling for Webkit */
.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  /* MODIFIED: Vertically center the thumb on the track */
  margin-top: -1.1px; 
}
.dark .progress-bar::-webkit-slider-thumb {
  background: #222;
  border-color: rgba(255, 255, 255, 0.2);
}

/* Thumb styling for Firefox */
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
