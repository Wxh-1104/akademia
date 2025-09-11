<template>
  <div class="gemini-chat-widget">
    <!-- API Key Input Section (unchanged) -->
    <div class="api-key-section" v-if="!apiKeyIsSaved">
      <label for="apiKeyInput">请输入您的 Google Gemini API 密钥</label>
      <div class="input-wrapper">
        <input id="apiKeyInput" type="password" v-model="apiKey" placeholder="在此处粘贴 API Key..." />
        <button @click="saveApiKey">保存</button>
      </div>
      <p class="api-key-notice">
        密钥将仅保存在您的浏览器缓存中。请勿在公共或不信任的计算机上使用该功能！<br></br>
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">点此获取免费 API 密钥</a>
      </p>
    </div>

    <!-- Chat Interface -->
    <div v-else class="chat-interface">
      <div class="chat-history" ref="chatHistoryEl">
        <div class="message model">
          <div class="markdown-body" v-html="renderMarkdown('你好！有什么可以帮助你的吗？')"></div>
        </div>
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          <div class="markdown-body" v-html="renderMarkdown(msg.content)"></div>
        </div>
        <div v-if="isLoading" class="message model loading">
          <div class="dot-flashing"></div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        <p>发生错误：{{ error }}</p>
      </div>

      <!-- Input Area -->
      <form @submit.prevent="sendMessage" class="input-area">
        <textarea
          ref="textareaEl"
          v-model="userPrompt"
          placeholder="输入您的问题..."
          @keydown.enter.exact.prevent="sendMessage"
          @input="autoResizeTextarea"
          :disabled="isLoading"
          rows="1"
        ></textarea>
        <button type="submit" :disabled="isLoading || !userPrompt.trim()">发送</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'; // Removed unused `watch`
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import hljs from 'highlight.js';

// --- State Management ---
const apiKey = ref('');
const apiKeyIsSaved = ref(false);
const userPrompt = ref('');
const messages = ref([]);
const isLoading = ref(false);
const error = ref(null);
const chatHistoryEl = ref(null);
const textareaEl = ref(null); // Ref for the textarea element

// --- Markdown & Highlight.js Configuration ---
marked.setOptions({
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  gfm: true,
  breaks: true,
});
const renderMarkdown = (text) => marked.parse(text);

// --- Core AI Logic ---
const sendMessage = async () => {
  if (!userPrompt.value.trim() || isLoading.value) return;

  const currentPrompt = userPrompt.value;
  messages.value.push({ role: 'user', content: currentPrompt });
  userPrompt.value = '';
  isLoading.value = true;
  error.value = null;

  // Reset textarea height after sending
  await nextTick(() => autoResizeTextarea());
  
  await nextTick();
  scrollToBottom();

  try {
    const genAI = new GoogleGenerativeAI(apiKey.value);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(currentPrompt);
    const response = await result.response;
    const text = response.text();
    messages.value.push({ role: 'model', content: text });
  } catch (e) {
    console.error(e);
    error.value = e.message || "无法连接到 AI 服务，请检查 API 密钥或网络连接。";
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
};

// --- API Key Management (unchanged) ---
const saveApiKey = () => {
  if (apiKey.value.trim()) {
    localStorage.setItem('gemini-api-key', apiKey.value);
    apiKeyIsSaved.value = true;
  }
};

onMounted(() => {
  const savedKey = localStorage.getItem('gemini-api-key');
  if (savedKey) {
    apiKey.value = savedKey;
    apiKeyIsSaved.value = true;
  }
  // Initial resize on mount
  nextTick(() => autoResizeTextarea());
});

// --- Utility Functions ---
const scrollToBottom = () => {
  if (chatHistoryEl.value) {
    chatHistoryEl.value.scrollTop = chatHistoryEl.value.scrollHeight;
  }
};

// 【新增】自动调整 textarea 高度的函数
const autoResizeTextarea = () => {
  const el = textareaEl.value;
  if (el) {
    // 关键：先重置高度，这样才能正确地缩小
    el.style.height = 'auto';
    // 将高度设置为内容的实际滚动高度
    el.style.height = `${el.scrollHeight}px`;
  }
};
</script>

<style>
/* Import and Root variables (unchanged) */
@import 'highlight.js/styles/github-dark.css';
:root {
  --chat-bg-user: var(--vp-c-brand-soft);
  --chat-bg-model: var(--vp-c-bg-soft);
}

/* --- Main Widget Styling --- */
.gemini-chat-widget {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  /* 【核心修改】用 max-height 替换固定的 height 和 min-height */
  max-height: 70vh;

  background-color: var(--vp-c-bg);
}

/* API Key Section (unchanged) */
.api-key-section { padding: 24px; text-align: center; }
.api-key-section label { display: block; margin-bottom: 12px; font-weight: 600; }
.api-key-section .input-wrapper { display: flex; gap: 8px; margin-bottom: 12px; }
.api-key-section input { flex-grow: 1; padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background-color: var(--vp-c-bg-soft); }
.api-key-section button { padding: 8px 16px; border-radius: 6px; background-color: var(--vp-c-brand-1); color: var(--vp-c-white); border: none; cursor: pointer; }
.api-key-notice { font-size: 12px; color: var(--vp-c-text-2); }

/* Chat Interface and History (unchanged) */
.chat-interface { display: flex; flex-direction: column; height: 100%; }
.chat-history { flex-grow: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 16px; }

/* Message Bubble Styling (unchanged) */
.message { display: inline-block; padding: 12px 16px; border-radius: 8px; max-width: 85%; line-height: 1.6; }
.message.model { background-color: var(--chat-bg-model); align-self: flex-start; }
.message.user { background-color: var(--chat-bg-user); align-self: flex-end; }
.message.loading { background-color: transparent; }

/* Markdown Body and Error Styles (unchanged) */
.markdown-body { font-size: 15px; }
.markdown-body > :first-child { margin-top: 0; }
.markdown-body > :last-child { margin-bottom: 0; }
.markdown-body pre { background-color: #2d2d2d; padding: 1em; border-radius: 6px; }
.error-message { padding: 12px 16px; background-color: var(--vp-c-red-soft); color: var(--vp-c-red-1); border-bottom: 1px solid var(--vp-c-divider); }

/* Loading Indicator (unchanged) */
.loading .dot-flashing { position: relative; width: 10px; height: 10px; border-radius: 5px; background-color: var(--vp-c-text-2); color: var(--vp-c-text-2); animation: dotFlashing 1s infinite linear alternate; animation-delay: .5s; }
.loading .dot-flashing::before, .loading .dot-flashing::after { content: ''; display: inline-block; position: absolute; top: 0; }
.loading .dot-flashing::before { left: -15px; width: 10px; height: 10px; border-radius: 5px; background-color: var(--vp-c-text-2); color: var(--vp-c-text-2); animation: dotFlashing 1s infinite alternate; animation-delay: 0s; }
.loading .dot-flashing::after { left: 15px; width: 10px; height: 10px; border-radius: 5px; background-color: var(--vp-c-text-2); color: var(--vp-c-text-2); animation: dotFlashing 1s infinite alternate; animation-delay: 1s; }
@keyframes dotFlashing { 0% { background-color: var(--vp-c-text-2); } 50%, 100% { background-color: rgba(152, 128, 255, 0.2); } }

/* Input Area Styling (unchanged) */
.input-area { display: flex; padding: 16px; border-top: 1px solid var(--vp-c-divider); gap: 8px; align-items: flex-end; }
.input-area textarea { flex-grow: 1; padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 6px; resize: none; background-color: var(--vp-c-bg-soft); line-height: 1.5; max-height: 88px; overflow-y: auto; font-family: inherit; font-size: 14px; }
.input-area button { padding: 8px 16px; border-radius: 6px; background-color: var(--vp-c-brand-1); color: var(--vp-c-white); cursor: pointer; font-size: 14px; line-height: 1.5; border: 1px solid transparent; }
.input-area button:disabled { background-color: var(--vp-c-gray-soft); cursor: not-allowed; }
</style>