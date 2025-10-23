<template>
  <div class="nav-grid" :style="{ '--columns': columns }">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: [Number, String],
    default: 3 // 默认每行显示 3 个
  }
});
</script>

<style scoped>
.nav-grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: 1rem;
}
</style>