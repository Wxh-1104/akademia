<template>
  <div class="file-tree-item" :style="{ paddingLeft: `${level * 12}px` }">
    <!-- 文件夹卡片 -->
    <div
      v-if="item.type === 'folder'"
      class="file-card folder-card"
      @click="toggleFolder"
    >
      <div class="card-icon">
        <Icon
          :icon="isExpanded ? 'mdi:folder-open' : 'mdi:folder'"
          :style="{ color: 'var(--folder-color)', fontSize: '24px' }"
        />
      </div>
      <div class="card-content">
        <h3 class="file-name">{{ item.name }}</h3>
        <p class="file-info">{{ getFolderInfo() }}</p>
      </div>
      <div class="expand-icon">
        <Icon
          :icon="isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'"
          :style="{ fontSize: '20px' }"
        />
      </div>
    </div>

    <!-- 文件卡片 -->
    <div v-else class="file-card file-item-card" @click="downloadFile">
      <div class="card-icon">
        <Icon
          :icon="getFileIcon()"
          :style="{ color: 'var(--file-color)', fontSize: '24px' }"
        />
      </div>
      <div class="card-content">
        <h3 class="file-name">{{ item.name }}</h3>
        <p class="file-info">{{ formatFileSize(fileSize) }}</p>
      </div>
      <div class="download-icon">
        <Icon
          icon="mdi:download"
          :style="{ fontSize: '20px', color: 'var(--vp-c-brand)' }"
        />
      </div>
    </div>

    <!-- 递归渲染子文件夹和文件 -->
    <transition name="expand">
      <div v-if="item.type === 'folder' && isExpanded" class="folder-children">
        <FileTreeItem
          v-for="child in item.children"
          :key="child.name"
          :item="child"
          :basePath="basePath"
          :level="level + 1"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
});

const isExpanded = ref(false);
const fileSize = ref(props.item.size || null);

const toggleFolder = () => {
  if (props.item.type === "folder") {
    isExpanded.value = !isExpanded.value;
  }
};

const downloadFile = () => {
  if (props.item.type === "file") {
    const filePath = props.item.path || `${props.basePath}${props.item.name}`;
    const link = document.createElement("a");
    link.href = filePath;
    link.download = props.item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// 自动获取文件大小
const fetchFileSize = async () => {
  if (props.item.type === "file" && !fileSize.value) {
    try {
      const filePath = props.item.path || `${props.basePath}${props.item.name}`;
      const response = await fetch(filePath, { method: "HEAD" });
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        fileSize.value = parseInt(contentLength, 10);
      }
    } catch (error) {
      // 如果获取失败，保持为 null
      console.warn(`无法获取文件大小: ${props.item.name}`);
    }
  }
};

onMounted(() => {
  if (props.item.type === "file") {
    fetchFileSize();
  }
});

const getFileIcon = () => {
  const ext = props.item.name.split(".").pop()?.toLowerCase();
  const iconMap = {
    pdf: "mdi:file-pdf-box",
    doc: "mdi:file-word-box",
    docx: "mdi:file-word-box",
    xls: "mdi:file-excel-box",
    xlsx: "mdi:file-excel-box",
    ppt: "mdi:file-powerpoint-box",
    pptx: "mdi:file-powerpoint-box",
    txt: "mdi:file-document-outline",
    md: "mdi:language-markdown",
    zip: "mdi:folder-zip",
    rar: "mdi:folder-zip",
    "7z": "mdi:folder-zip",
    jpg: "mdi:file-image",
    jpeg: "mdi:file-image",
    png: "mdi:file-image",
    gif: "mdi:file-image",
    svg: "mdi:file-image",
    mp3: "mdi:file-music",
    mp4: "mdi:file-video",
    avi: "mdi:file-video",
    mov: "mdi:file-video",
  };
  return iconMap[ext] || "mdi:file-outline";
};

const formatFileSize = (bytes) => {
  if (!bytes) return "未知大小";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
};

const getFolderInfo = () => {
  if (!props.item.children) return "空文件夹";
  const fileCount = props.item.children.filter((c) => c.type === "file").length;
  const folderCount = props.item.children.filter(
    (c) => c.type === "folder"
  ).length;
  const parts = [];
  if (folderCount > 0) parts.push(`${folderCount} 个文件夹`);
  if (fileCount > 0) parts.push(`${fileCount} 个文件`);
  return parts.join(", ") || "空文件夹";
};
</script>

<style scoped>
.file-tree-item {
  margin: 8px 0;
  width: 100%;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.file-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--vp-c-brand);
  transform: translateX(-4px);
  transition: transform 0.25s ease;
}

.file-card:hover::before {
  transform: translateX(0);
}

.file-card:hover {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg);
}

.folder-card {
  --folder-color: var(--vp-c-brand);
}

.file-item-card {
  --file-color: var(--vp-c-text-2);
}

.card-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--vp-c-default-soft);
  transition: background-color 0.25s;
}

.file-card:hover .card-icon {
  background-color: var(--vp-c-brand-soft);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.file-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.file-info {
  margin: 2px 0 0 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.expand-icon,
.download-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  transition: color 0.25s, transform 0.25s;
}

.file-card:hover .expand-icon,
.file-card:hover .download-icon {
  color: var(--vp-c-brand);
}

.download-icon {
  opacity: 0;
  transform: translateX(-8px);
}

.file-card:hover .download-icon {
  opacity: 1;
  transform: translateX(0);
}

.folder-children {
  margin-top: 8px;
  margin-left: 12px;
  padding-left: 12px;
  border-left: 2px solid var(--vp-c-divider-light);
}

/* 展开/折叠动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
}

/* 深色模式调整 */
html.dark .file-card {
  background-color: var(--vp-c-bg-soft);
}

html.dark .file-card:hover {
  background-color: var(--vp-c-bg-alt);
}
</style>
