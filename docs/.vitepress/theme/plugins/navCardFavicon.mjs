// .vitepress/plugins/faviconPlugin.mjs
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import { simpleHash } from './hash.mjs'; // 1. 导入哈希函数

const VIRTUAL_MODULE_ID = 'virtual:favicon-map';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

export function faviconPlugin(options = {}) {
  // ... 配置保持不变 ...
  const {
    docsDir = 'docs',
    iconOutputDir = 'docs/public/nav-card-favicons',
    mapFile = 'docs/public/nav-card-favicons/favicon-map.json',
  } = options;

  let finalHashMap = {};

  return {
    name: 'vitepress-favicon-fetcher',
    resolveId(id) { /* ... 保持不变 ... */
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID;
    },
    load(id) { /* ... 保持不变 ... */
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export default ${JSON.stringify(finalHashMap)}`;
      }
    },
    async buildStart() {
      console.log('[Favicon Plugin] Starting favicon fetch process...');

      // --- 核心逻辑重写 ---

      fs.mkdirSync(iconOutputDir, { recursive: true });

      const files = glob.sync(`${docsDir}/**/*.md`);
      // 2. 更强大的正则表达式，可以捕获多行属性
      const cardRegex = /<NavCard([\s\S]*?)>/g;
      const propRegex = /(\w+)="([^"]+)"/g;

      const cardInstances = [];
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        let match;
        while ((match = cardRegex.exec(content)) !== null) {
          const props = {};
          let propMatch;
          while ((propMatch = propRegex.exec(match[1])) !== null) {
            props[propMatch[1]] = propMatch[2];
          }
          if (props.link && props.title) {
            cardInstances.push(props);
          }
        }
      }

      console.log(`[Favicon Plugin] Found ${cardInstances.length} NavCard instances.`);

      // 用于缓存域名->图标的映射，避免重复下载
      const domainIconCache = {};
      finalHashMap = {};

      const tasks = cardInstances.map(async (props) => {
        const { link, title, description = '' } = props;
        
        // 3. 计算唯一的哈希 ID
        const hashId = simpleHash(title + description);
        
        if (!link.startsWith('http')) return;

        try {
          const hostname = new URL(link).hostname;

          // 4. 检查缓存，如果该域名的图标已处理，则直接使用
          if (domainIconCache[hostname]) {
            finalHashMap[hashId] = domainIconCache[hostname];
            return;
          }

          const googleUrl = `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
          const response = await fetch(googleUrl);
          if (!response.ok) throw new Error(`Status ${response.status}`);
          
          const buffer = await response.arrayBuffer();
          if (buffer.byteLength < 500) {
            console.warn(`[Favicon Plugin] Skipping invalid favicon for ${hostname}`);
            // 即使无效，也标记为已处理，避免重复请求
            domainIconCache[hostname] = null;
            return;
          }
          
          const publicPath = `/nav-card-favicons/${hostname}.png`;
          const iconPath = path.join(iconOutputDir, `${hostname}.png`);
          fs.writeFileSync(iconPath, Buffer.from(buffer));
          
          console.log(`[Favicon Plugin] Fetched favicon for ${hostname}`);
          
          // 5. 填充两个缓存/映射
          domainIconCache[hostname] = publicPath;
          finalHashMap[hashId] = publicPath;

        } catch (error) {
          console.error(`[Favicon Plugin] Error for ${link}:`, error.message);
          domainIconCache[new URL(link).hostname] = null; // 标记为失败
        }
      });

      await Promise.all(tasks);

      fs.writeFileSync(mapFile, JSON.stringify(finalHashMap, null, 2));
      console.log('[Favicon Plugin] Process completed!');
    },
  };
}