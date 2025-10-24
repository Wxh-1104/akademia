<template>
  <a :href="link" class="nav-card" :style="cardStyle">
    <div class="card-content">
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
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
  colorLight: {
    type: String,
    required: false
  },
  colorDark: {
    type: String,
    required: false
  }
});

const cardStyle = computed(() => {
  const styles = {};
  if (props.colorLight) {
    styles['--nav-card-color-light'] = props.colorLight;
  }
  if (props.colorDark) {
    styles['--nav-card-color-dark'] = props.colorDark;
  }
  return styles;
});
</script>

<style scoped>
.nav-card {
  display: block;
  border: 1px dashed var(--vp-c-bg-soft);
  border-radius: 16px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  position: relative;

  --nav-card-theme-color: var(--nav-card-color-light, var(--vp-c-brand));
}

html.dark .nav-card {
  --nav-card-theme-color: var(--nav-card-color-dark, var(--vp-c-brand));
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

  background-color: var(--nav-card-theme-color);

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

html.dark .nav-card::after {
  opacity: 0.1;
}

.nav-card:hover {
  border-color: var(--nav-card-theme-color);
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
  color: var(--nav-card-theme-color);
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
