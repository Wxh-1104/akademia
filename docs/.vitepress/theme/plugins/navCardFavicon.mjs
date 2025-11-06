import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import { simpleHash } from './hash.mjs';

const VIRTUAL_MODULE_ID = 'virtual:favicon-map';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

export function faviconPlugin(options = {}) {
  const {
    docsDir = 'docs',
    iconOutputDir = 'docs/public/temp/nav-card-favicons',
    mapFile = 'docs/public/temp/nav-card-favicons/favicon-map.json',
  } = options;

  let finalHashMap = {};

  return {
    name: 'vitepress-favicon-fetcher',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export default ${JSON.stringify(finalHashMap)}`;
      }
    },
    async buildStart() {
      console.log('[Favicon Plugin] Starting favicon fetch process...');

      fs.mkdirSync(iconOutputDir, { recursive: true });

      const files = glob.sync(`${docsDir}/**/*.md`);
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

      const domainIconCache = {};
      finalHashMap = {};

      const tasks = cardInstances.map(async (props) => {
        const { link, title, description = '' } = props;
        
        const hashId = simpleHash(title + description);
        
        if (!link.startsWith('http')) return;

        try {
          const hostname = new URL(link).hostname;

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
            domainIconCache[hostname] = null;
            return;
          }
          
          const publicPath = `/temp/nav-card-favicons/${hostname}.png`;
          const iconPath = path.join(iconOutputDir, `${hostname}.png`);
          fs.writeFileSync(iconPath, Buffer.from(buffer));
          
          console.log(`[Favicon Plugin] Fetched favicon for ${hostname}`);
          
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