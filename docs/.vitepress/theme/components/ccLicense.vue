<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()

/**
 * 本组件支持的协议：
 * - 知识共享协议 (Creative Commons, CC)
 *   - CC0-1.0
 *   - CC-BY-4.0
 *   - CC-BY-SA-4.0
 *   - CC-BY-ND-4.0
 *   - CC-BY-NC-4.0
 *   - CC-BY-NC-SA-4.0
 *   - CC-BY-NC-ND-4.0
 * - 开源许可证
 *   - MIT
 *   - Apache-2.0
 *   - GPL-3.0
 */

const licenses = {
  // ============ CC 系列 ============
  "CC0-1.0": {
    name: "CC0 1.0 公共领域贡献",
    url: "https://creativecommons.org/publicdomain/zero/1.0/deed.zh",
    icons: [
      "https://mirrors.creativecommons.org/presskit/icons/cc.svg",
      "https://mirrors.creativecommons.org/presskit/icons/zero.svg"
    ]
  },
  "CC-BY-4.0": {
    name: "署名 4.0 国际 (CC BY 4.0)",
    url: "https://creativecommons.org/licenses/by/4.0/deed.zh",
    icons: [
      "https://mirrors.creativecommons.org/presskit/icons/cc.svg",
      "https://mirrors.creativecommons.org/presskit/icons/by.svg"
    ]
  },
  "CC-BY-SA-4.0": {
    name: "署名-相同方式共享 4.0 国际 (CC BY-SA 4.0)",
    url: "https://creativecommons.org/licenses/by-sa/4.0/deed.zh",
    icons: [
      "https://mirrors.creativecommons.org/presskit/icons/cc.svg",
      "https://mirrors.creativecommons.org/presskit/icons/by.svg",
      "https://mirrors.creativecommons.org/presskit/icons/sa.svg"
    ]
  },
  "CC-BY-ND-4.0": {
    name: "署名-禁止演绎 4.0 国际 (CC BY-ND 4.0)",
    url: "https://creativecommons.org/licenses/by-nd/4.0/deed.zh",
    icons: [
      "https://mirrors.creativecommons.org/presskit/icons/cc.svg",
      "https://mirrors.creativecommons.org/presskit/icons/by.svg",
      "https://mirrors.creativecommons.org/presskit/icons/nd.svg"
    ]
  },
  "CC-BY-NC-4.0": {
    name: "署名-非商业性使用 4.0 国际 (CC BY-NC 4.0)",
    url: "https://creativecommons.org/licenses/by-nc/4.0/deed.zh",
    icons: [
      "https://mirrors.creativecommons.org/presskit/icons/cc.svg",
      "https://mirrors.creativecommons.org/presskit/icons/by.svg",
      "https://mirrors.creativecommons.org/presskit/icons/nc.svg"
    ]
  },
  "CC-BY-NC-SA-4.0": {
    name: "署名-非商业性使用-相同方式共享 4.0 国际 (CC BY-NC-SA 4.0)",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh",
    icons: [
      "https://mirrors.creativecommons.org/presskit/icons/cc.svg",
      "https://mirrors.creativecommons.org/presskit/icons/by.svg",
      "https://mirrors.creativecommons.org/presskit/icons/nc.svg",
      "https://mirrors.creativecommons.org/presskit/icons/sa.svg"
    ]
  },
  "CC-BY-NC-ND-4.0": {
    name: "署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0)",
    url: "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh",
    icons: [
      "https://mirrors.creativecommons.org/presskit/icons/cc.svg",
      "https://mirrors.creativecommons.org/presskit/icons/by.svg",
      "https://mirrors.creativecommons.org/presskit/icons/nc.svg",
      "https://mirrors.creativecommons.org/presskit/icons/nd.svg"
    ]
  },

  // ============ 开源协议 ============
  "MIT": {
    name: "MIT 许可协议",
    url: "https://opensource.org/licenses/MIT",
    icons: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/Logo_mit_license.svg"
    ]
  },
  "Apache-2.0": {
    name: "Apache 许可证 2.0 版",
    url: "https://www.apache.org/licenses/LICENSE-2.0",
    icons: [
      "https://www.apache.org/img/asf-estd-1999-logo.jpg"
    ]
  },
  "GPL-3.0": {
    name: "GNU 通用公共许可证 第3版 (GPLv3)",
    url: "https://www.gnu.org/licenses/gpl-3.0.html",
    icons: [
      "https://www.gnu.org/graphics/gplv3-127x51.png"
    ]
  }
}

const licenseKey = frontmatter.value.license
const license = licenseKey ? licenses[licenseKey] : null
</script>

<template>
  <div v-if="license" class="cc-license-box">
    <div class="cc-row">
      <div class="cc-icons">
        <img v-for="(icon, idx) in license.icons" :key="idx" :src="icon" :alt="license.name" />
      </div>
      <div class="cc-text">
        本文采用
        <a :href="license.url" target="_blank" rel="noopener noreferrer">
          {{ license.name }}
        </a>
        授权。
      </div>
    </div>
  </div>
</template>

<style scoped>
.cc-license-box {
  margin-bottom: 16px;
  padding: 0.6rem 0.6rem;
  border: 3px dashed var(--vp-c-divider) ;
  border-radius: 20px;
  background: var(--vp-c-bg-alt);
  font-size: 1rem;
  font-weight: bold;
}
.cc-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
}
.cc-icons {
  flex: 0 0 auto;
  display: flex;
  margin-right: 0.4rem;
}
.cc-icons img {
  height: 20px;
  margin-right: 4px;
  vertical-align: middle;
}
.cc-text {
  flex: 1;
  line-height: 1.2;
  word-break: break-word;
}
</style>
