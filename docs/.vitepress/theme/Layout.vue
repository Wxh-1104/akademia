<script setup>
// --- 默认主题和自定义组件导入 ---
import DefaultTheme from 'vitepress/theme'
import AudioPlayer from './components/audioPlayer.vue' // 确保路径正确

// --- 新增：导入 Vue 和 VitePress 的 API ---
import { useData } from 'vitepress'
import { computed } from 'vue'

// --- 核心逻辑 ---
const { Layout } = DefaultTheme

// 新增：使用 useData 获取 frontmatter
const { frontmatter } = useData()

// 新增：创建一个计算属性来动态获取 class
const layoutClass = computed(() => {
  // 这段逻辑完全来自于您之前的 index.ts 文件
  return frontmatter.value?.layoutClass || ''
})
</script>

<template>
  <!-- 
    将计算出的 class 绑定到 <Layout> 组件上。
    Vue 会自动处理空字符串，所以如果 frontmatter 中没有 layoutClass，就不会添加任何 class。
  -->
  <Layout :class="layoutClass">
    <!-- 透传所有默认主题的插槽 -->
    <template #layout-top><slot name="layout-top" /></template>
    <template #layout-bottom><slot name="layout-bottom" /></template>
    <template #nav-bar-title-before><slot name="nav-bar-title-before" /></template>
    <template #nav-bar-title-after><slot name="nav-bar-title-after" /></template>
    <template #nav-bar-content-before><slot name="nav-bar-content-before" /></template>
    <template #nav-bar-content-after><slot name="nav-bar-content-after" /></template>
    <template #nav-screen-content-before><slot name="nav-screen-content-before" /></template>
    <template #nav-screen-content-after><slot name="nav-screen-content-after" /></template>
    <template #sidebar-nav-before><slot name="sidebar-nav-before" /></template>
    <template #sidebar-nav-after><slot name="sidebar-nav-after" /></template>
    <template #doc-before><slot name="doc-before" /></template>
    <template #doc-after><slot name="doc-after" /></template>
    <template #doc-footer-before><slot name="doc-footer-before" /></template>
    <template #aside-top><slot name="aside-top" /></template>
    <template #aside-bottom><slot name="aside-bottom" /></template>
    <template #aside-outline-before><slot name="aside-outline-before" /></template>
    <template #aside-outline-after><slot name="aside-outline-after" /></template>
    <template #page-top><slot name="page-top" /></template>
    <template #page-bottom><slot name="page-bottom" /></template>
  </Layout>

  <!-- 您的全局组件 -->
  <AudioPlayer title="Reunited" />
</template>