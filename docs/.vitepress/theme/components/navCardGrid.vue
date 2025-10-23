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
  grid-template-columns: 1fr;
  gap: 0.8rem;
}
/* 当屏幕宽度大于等于 640px 时 (通常认为是平板或桌面) */
@media (min-width: 640px) {
  .nav-grid {
    /* 应用用户通过 prop 传入的列数 */
    grid-template-columns: repeat(var(--columns), 1fr);
  }
}
</style>