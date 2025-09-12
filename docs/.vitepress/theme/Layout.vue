<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import AudioPlayer from "./components/audioPlayer.vue"; // 假设你把播放器放在 .vitepress/components/AudioPlayer.vue

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <AudioPlayer />
    </template>
  </Layout>
</template>
