<template>
  <a :href="link" class="nav-card">
    <div class="card-content">
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>
    </div>
  </a>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.nav-card {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 16px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
}

.nav-card:hover {
  border-color: var(--vp-c-brand);
}

.card-content {
  padding: 8px 10px 10px 12px;
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 3px 0;
  line-height: 1.5;
  color: var(--vp-c-brand);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  font-size: 0.83rem;
  margin: 0;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>