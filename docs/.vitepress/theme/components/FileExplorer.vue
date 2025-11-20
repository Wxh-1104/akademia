<template>
  <div class="file-explorer">
    <div v-if="loading" class="loading-state">加载中...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <FileTreeItem
      v-else
      v-for="item in currentFileStructure"
      :key="item.name"
      :item="item"
      :basePath="basePath"
      :level="0"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import FileTreeItem from "./FileTreeItem.vue";

const props = defineProps({
  basePath: {
    type: String,
    default: "/files/",
  },
  fileStructure: {
    type: Array,
    default: null,
  },
  configPath: {
    type: String,
    default: null,
  },
});

const currentFileStructure = ref([]);
const loading = ref(false);
const error = ref(null);

const loadConfig = async () => {
  if (props.fileStructure) {
    // 如果直接提供了 fileStructure，直接使用
    currentFileStructure.value = props.fileStructure;
    return;
  }

  if (props.configPath) {
    // 从 JSON 文件加载
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(props.configPath);
      if (!response.ok) {
        throw new Error(`无法加载配置文件: ${props.configPath}`);
      }
      const data = await response.json();
      currentFileStructure.value = Array.isArray(data)
        ? data
        : data.files || [];
    } catch (err) {
      error.value = err.message;
      console.error("加载文件结构配置失败:", err);
    } finally {
      loading.value = false;
    }
  } else {
    error.value = "请提供 fileStructure 或 configPath 属性";
  }
};

onMounted(() => {
  loadConfig();
});

watch(
  () => [props.fileStructure, props.configPath],
  () => {
    loadConfig();
  }
);
</script>

<style scoped>
.file-explorer {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 2px 10px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 20px;
  background-color: var(--vp-c-bg-alt);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

html.dark .file-explorer {
  background-color: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.loading-state,
.error-state {
  padding: 20px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.error-state {
  color: var(--vp-c-danger);
}
</style>
