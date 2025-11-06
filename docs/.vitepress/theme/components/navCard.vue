<template>
  <a :href="link" class="nav-card" :style="cardStyle">
    <template v-if="displayIconUrl">
      <img v-if="!isFallbackIcon" :src="displayIconUrl" alt="" class="favicon" />
      <div v-else class="favicon favicon-fallback"></div>
    </template>

    <div class="card-content">
      <h3 class="title" :title="title">{{ title }}</h3>
      <p class="description" :title="description">{{ description }}</p>
    </div>
  </a>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: false },
  link: { type: String, required: true },
  colorLight: { type: String, required: false },
  colorDark: { type: String, required: false },
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

const FALLBACK_ICON_PATH = '/icons/navCard-fallback-favicon.svg'; 
const displayIconUrl = ref('');

const isFallbackIcon = computed(() => displayIconUrl.value === FALLBACK_ICON_PATH);

const checkAndSetFavicon = (link) => {
  if (!link || !link.startsWith('http')) {
    displayIconUrl.value = '';
    return;
  }
  try {
    const url = new URL(link);
    const googleFaviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${url.hostname}`;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth <= 16) {
        displayIconUrl.value = FALLBACK_ICON_PATH;
      } else {
        displayIconUrl.value = googleFaviconUrl;
      }
    };
    img.onerror = () => {
      displayIconUrl.value = FALLBACK_ICON_PATH;
    };
    img.src = googleFaviconUrl;
  } catch (e) {
    displayIconUrl.value = FALLBACK_ICON_PATH;
  }
};

watch(() => props.link, (newLink) => {
  checkAndSetFavicon(newLink);
}, { immediate: true });
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
  font-family: var(--vp-font-family-base) !important;
  font-size: 1.2rem;
  font-weight: normal !important;
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

.favicon {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: var(--vp-c-bg-soft);
  z-index: 2;
}

.favicon-fallback {
  background-color: var(--nav-card-theme-color);
  mask-image: url("/icons/navCard-fallback-favicon.svg");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url("/icons/navCard-fallback-favicon.svg");
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>