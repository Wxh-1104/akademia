import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 扫描目录并生成文件结构
 * @param {string} dirPath - 要扫描的目录路径
 * @param {string} basePath - 基础路径（用于生成 path 字段）
 * @param {Array<string>} excludes - 要排除的文件/文件夹名称
 * @returns {Array} 文件结构数组
 */
function scanDirectory(dirPath, basePath = "", excludes = []) {
  const items = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      // 跳过排除的项
      if (excludes.includes(entry.name)) {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(basePath, entry.name);

      if (entry.isDirectory()) {
        // 递归扫描子目录
        const children = scanDirectory(fullPath, relativePath, excludes);
        items.push({
          name: entry.name,
          type: "folder",
          children: children,
        });
      } else if (entry.isFile()) {
        // 获取文件大小
        const stats = fs.statSync(fullPath);
        items.push({
          name: entry.name,
          type: "file",
          path: `/${relativePath.replace(/\\/g, "/")}`,
          size: stats.size,
        });
      }
    }
  } catch (error) {
    console.error(`[File Structure] 扫描目录失败: ${dirPath}`, error);
  }

  return items;
}

/**
 * 为指定目录生成 structure.json
 */
function generateStructureForDir(publicFilesDir, dirName) {
  const targetDir = path.join(publicFilesDir, dirName);

  if (!fs.existsSync(targetDir)) {
    return;
  }

  console.log(`[File Structure] 扫描目录: ${dirName}`);

  const structure = scanDirectory(targetDir, `files/${dirName}`, [
    "structure.json",
    ".DS_Store",
    "Thumbs.db",
    ".gitkeep",
  ]);

  const outputPath = path.join(targetDir, "structure.json");
  fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2), "utf-8");

  console.log(
    `[File Structure] ✓ 已生成: ${dirName}/structure.json (${structure.length} 项)`
  );
}

/**
 * VitePress Plugin: 文件结构生成器
 */
export function fileStructurePlugin(options = {}) {
  const { filesDir = "docs/public/files" } = options;

  return {
    name: "vitepress-file-structure-generator",

    buildStart() {
      console.log("[File Structure] 开始生成文件结构...");

      const publicFilesDir = path.resolve(filesDir);

      if (!fs.existsSync(publicFilesDir)) {
        console.warn(`[File Structure] 目录不存在: ${publicFilesDir}`);
        return;
      }

      const entries = fs.readdirSync(publicFilesDir, { withFileTypes: true });
      let count = 0;

      for (const entry of entries) {
        if (entry.isDirectory()) {
          generateStructureForDir(publicFilesDir, entry.name);
          count++;
        }
      }

      console.log(`[File Structure] ✓ 完成！共处理 ${count} 个目录\n`);
    },
  };
}
