<template>
  <div ref="editor"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import startDocDefault from './markdownPlayground-startDoc.md?raw'

const props = defineProps({
  title: {
    type: String,
    default: 'Markdown Playground'
  },
  // 1. 【新增】定义 cacheKey prop，用于 localStorage 的唯一键
  cacheKey: {
    type: String,
    default: 'codemirror-markdown-content'
  }
})

const editor = ref(null)
let view = null
let observer = null

const themeCompartment = new Compartment()
const activeTheme = ref(oneDark)

// --- 主题切换逻辑 (不变) ---
watch(activeTheme, (newTheme) => {
  if (view) {
    view.dispatch({
      effects: themeCompartment.reconfigure(newTheme)
    })
  }
})

function syncTheme() {
  const isDark = document.documentElement.classList.contains('dark')
  activeTheme.value = isDark ? oneDark : []
}
// --- -------------------- ---

onMounted(() => {
  // 2. 【新增】加载缓存内容的逻辑
  let startDoc = startDocDefault
  try {
    const cachedContent = localStorage.getItem(props.cacheKey)
    if (cachedContent) {
      startDoc = cachedContent
    }
  } catch (e) {
    console.error("无法从 localStorage 加载内容:", e)
  }

  // 3. 【新增】内容变化时自动保存的扩展
  let debounceTimeout
  const saveExtension = EditorView.updateListener.of((update) => {
    // 只在文档内容实际发生变化时触发
    if (update.docChanged) {
      // 使用防抖技术，避免频繁写入
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        try {
          localStorage.setItem(props.cacheKey, update.state.doc.toString())
        } catch (e) {
          console.error("无法向 localStorage 保存内容:", e)
        }
      }, 500) // 延迟500毫秒
    }
  })

  const state = EditorState.create({
    doc: startDoc,
    extensions: [
      basicSetup,
      markdown(),
      themeCompartment.of(activeTheme.value),
      saveExtension, // 4. 【新增】将保存扩展添加到配置中
      EditorView.theme({
        // --- 样式配置 (不变) ---
        "&": {
          fontSize: "14px",
          fontFamily: "var(--vp-font-family-mono)",
          'font-feature-settings': "var(--vp-font-feature-settings-mono)",
          'font-variant-ligatures': "var(--vp-font-variant-ligatures-mono)",
          lineHeight: "1.6",
          backgroundColor: "var(--vp-c-bg-soft)",
          border: "4px solid var(--vp-c-divider)",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          paddingTop: "32px", 
        },
        "&::before": {
          content: '""',
          display: 'block',
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '12px',
          height: '12px',
          backgroundColor: '#ff5f56',
          borderRadius: '50%',
          boxShadow: '20px 0 0 #ffbd2e, 40px 0 0 #27c93f',
        },
        "&::after": {
          content: `"${props.title}"`,
          display: 'block',
          position: 'absolute',
          top: '10px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--vp-c-text-2)',
          fontWeight: '900',
          lineHeight: '12px',
        },
        "&.cm-editor": { height: "auto", minHeight: "40px" },
        ".cm-gutters": {
          backgroundColor: "var(--vp-c-bg-soft)",
          paddingLeft: "10px",
        },
        ".cm-scroller": {
          overflow: "auto",
          borderTop: "1px solid var(--vp-c-divider)",
          paddingTop: "5px",
          paddingBottom: "5px"
        },
        ".cm-content": { padding: "0 8px" },
      })
    ]
  })

  view = new EditorView({
    state,
    parent: editor.value,
  })

  syncTheme()

  observer = new MutationObserver(() => {
    syncTheme()
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onUnmounted(() => {
  if (view) {
    view.destroy()
  }
  if (observer) {
    observer.disconnect()
  }
})
</script>