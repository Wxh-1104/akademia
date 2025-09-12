<script setup>
import { ref } from 'vue'

const audio = ref(null)
const playing = ref(false)

const togglePlay = () => {
  if (!audio.value) return
  if (playing.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  playing.value = !playing.value
}
</script>

<template>
  <div class="audio-player">
    <button class="btn" @click="togglePlay">
      {{ playing ? '⏸️' : '🎵' }}
    </button>
    <audio ref="audio" loop>
      <!-- 把音乐文件放到 .vitepress/public/music/bgm.mp3 -->
      <source src="/music/bgm.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
}

.btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #30a46c;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: background 0.3s;
}

.dark .btn  {
  background: #298459;
}

.btn:hover {
  background: #3dd68c;
}

.dark .btn::hover  {
  background: #30a46c;
}
</style>
