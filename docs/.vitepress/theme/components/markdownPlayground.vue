<template>
  <div ref="editor"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'

const editor = ref(null)

import startDoc from './markdownPlayground-startDoc.md?raw'

onMounted(() => {
  const state = EditorState.create({
    doc: startDoc,
    extensions: [
      basicSetup,
      markdown(),
      oneDark,
      EditorView.theme({
        // "&" 指向 .cm-editor (CodeMirror 的根元素)
        "&": {
          fontSize: "14px",
          fontFamily: "var(--vp-font-family-mono)",
          'font-feature-settings': "var(--vp-font-feature-settings-mono)",

          // 【新增】为整个编辑器设置统一的行高，这是对齐的关键！
          lineHeight: "1.6",

          border: "1px solid var(--vp-c-divider)",
          borderRadius: "8px",
          overflow: "hidden",
        },
        "&.cm-editor": {
          height: "auto",
          minHeight: "40px",
        },

        // 【核心修改】将垂直内边距应用到滚动容器上
        ".cm-scroller": {
          overflow: "auto",
          padding: "10px 0", // 在这里统一设置垂直内边距
        },

        // 【移除】不再需要为内容区单独设置垂直内边距
        ".cm-content": {
          // 仅保留水平内边距，确保代码和行号之间有空隙
          padding: "0 10px", 
        },

        // 【移除】不再需要为行号区域单独设置垂直内边距
        ".cm-gutters": {
          // 仅保留左侧内边距，让行号和边框有空隙
          paddingLeft: "10px",
        }
      })
    ]
  })

  new EditorView({
    state,
    parent: editor.value,
  })
})
</script>

<style>
/* 外部样式保持为空 */
</style>