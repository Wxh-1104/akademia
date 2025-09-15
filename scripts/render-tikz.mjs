import fs from "fs/promises";
import path from "path";
import { glob } from "glob";
// 我们要复用已有的渲染逻辑，所以从 .vitepress 目录导入它
import { renderTikz } from "../docs/.vitepress/tikz-renderer.mjs";

// 定义一个正则表达式来匹配所有的 tikz 代码块
const tikzRegex = /^```(?:\s*)tikz(.*)\n([\s\S]+?)\n```\s*$/gm;

async function scanAndRender() {
  console.log("[TikZ Pre-renderer] Starting scan...");

  // 查找 docs 目录下的所有 markdown 文件
  const markdownFiles = await glob("docs/**/*.md", {
    ignore: "node_modules/**",
  });

  let foundBlocks = 0;

  // 创建一个 Set 来存储所有唯一的 TikZ 代码块内容
  const uniqueTikzContents = new Set();

  for (const file of markdownFiles) {
    const content = await fs.readFile(file, "utf-8");
    let match;
    while ((match = tikzRegex.exec(content)) !== null) {
      // match[1] 是正则表达式中捕获组的内容，即 TikZ 代码
      uniqueTikzContents.add(match[1].trim());
    }
  }

  foundBlocks = uniqueTikzContents.size;
  if (foundBlocks === 0) {
    console.log("[TikZ Pre-renderer] No TikZ blocks found. Exiting.");
    return;
  }

  console.log(
    `[TikZ Pre-renderer] Found ${foundBlocks} unique TikZ blocks. Rendering...`
  );

  // 对所有唯一的代码块执行渲染
  // 使用 Promise.all 来并行处理，加快速度
  await Promise.all(
    Array.from(uniqueTikzContents).map((content) => {
      // renderTikz 是同步的，但在 Promise.all 中可以正常工作
      renderTikz(content);
    })
  );

  console.log("[TikZ Pre-renderer] All TikZ blocks have been processed.");
}

// 执行主函数
scanAndRender().catch((err) => {
  console.error("[TikZ Pre-renderer] An error occurred:", err);
  process.exit(1);
});
