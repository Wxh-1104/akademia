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
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: true,
  },
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
  position: relative;
}

.nav-card::after {
  content: "";
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 100px !important;
  height: 100px !important;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.25s;

  background-color: var(--vp-c-brand);

  mask-image: url("/icons/navCard-cursor.svg") !important;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;

  -webkit-mask-image: url("/icons/navCard-cursor.svg") !important;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;

  opacity: 0.1;
}

:deep(html.dark) .nav-card::after {
  opacity: 0.1;
}

.nav-card:hover {
  border-color: var(--vp-c-brand);
}

.card-content {
  padding: 8px 10px 10px 12px;
  position: relative;
  z-index: 1;
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
