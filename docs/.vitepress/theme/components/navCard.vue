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
}

.nav-card:hover {
  border-color: var(--vp-c-brand);
}

.card-content {
  padding: 12px 10px 10px 10px;
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 20px;
  color: var(--vp-c-brand);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  font-size: 0.9rem;
  margin: 0;
  line-height: 24px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>