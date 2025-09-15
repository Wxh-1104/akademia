// docs/.vitepress/tikz-renderer.js

import { execSync } from 'child_process';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const cacheDir = path.resolve(projectRoot, 'docs', 'public', 'cache', 'tikz');
const tempDir = path.join(cacheDir, 'temp');

fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });

const latexTemplate = (tikzContent) => `
\\documentclass[tikz, border=2pt]{standalone}
\\usepackage{tikz}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.17}
\\usetikzlibrary{arrows,automata,babel,calc,chains,intersections,matrix,mindmap,patterns,petri,shadows,shapes.geometric,shapes.misc,spy,trees}
\\begin{document}
${tikzContent}
\\end{document}
`;

export function renderTikz(tikzContent) {
  const hash = createHash('sha256').update(tikzContent).digest('hex');
  const svgFileName = `${hash}.svg`;
  const publicSvgPath = `/cache/tikz/${svgFileName}`;
  const absoluteSvgPath = path.join(cacheDir, svgFileName);

  console.log(`[TikZ] Rendering hash: ${hash}`);

  if (fs.existsSync(absoluteSvgPath)) {
    const stats = fs.statSync(absoluteSvgPath);
    if (stats.size > 0) {
      console.log(`[TikZ] Valid cache hit for ${svgFileName}.`);
      return publicSvgPath;
    }
    console.log(`[TikZ] Corrupted (0KB) cache file found. Deleting and re-rendering.`);
    fs.unlinkSync(absoluteSvgPath);
  }

  console.log(`[TikZ] Cache miss. Starting fresh render.`);
  
  const texFilePath = path.join(tempDir, `${hash}.tex`);
  const pdfFilePath = path.join(tempDir, `${hash}.pdf`);
  const logFilePath = path.join(tempDir, `${hash}.log`);

  fs.writeFileSync(texFilePath, latexTemplate(tikzContent));

  try {
    const pdflatexCommand = `pdflatex -output-directory="${tempDir}" -jobname="${hash}" "${texFilePath}"`;
    console.log(`[TikZ] Executing: ${pdflatexCommand}`);
    execSync(pdflatexCommand, { stdio: 'inherit' });

    if (!fs.existsSync(pdfFilePath)) {
      throw new Error(`PDF file was not generated at ${pdfFilePath}.`);
    }
    console.log(`[TikZ] PDF generated: ${pdfFilePath}`);

    // 直接调用 'pdf2svg'，假设它在系统的 PATH 中
    const pdf2svgCommand = `pdf2svg "${pdfFilePath}" "${absoluteSvgPath}"`;
    console.log(`[TikZ] Executing: ${pdf2svgCommand}`);
    execSync(pdf2svgCommand, { stdio: 'inherit' });

    if (!fs.existsSync(absoluteSvgPath) || fs.statSync(absoluteSvgPath).size === 0) {
      throw new Error(`SVG file generation failed at ${absoluteSvgPath}.`);
    }
    console.log(`[TikZ] SVG generated: ${absoluteSvgPath}`);
    
    return publicSvgPath;

  } catch (error) {
    console.error(`\n[TikZ] !!! RENDERING FAILED for hash: ${hash} !!!`);
    console.error('[TikZ] Error:', error.message);

    if (fs.existsSync(logFilePath)) {
      const logContent = fs.readFileSync(logFilePath, 'utf-8');
      console.error('\n--- LaTeX Compiler Log (last 50 lines) ---');
      console.error(logContent.split('\n').slice(-50).join('\n'));
      console.error('------------------------------------------\n');
    }
    return `<pre style="color: red; background-color: #fdd; padding: 1em;">TikZ Error: ${error.message}. Check terminal logs.</pre>`;
  }
}