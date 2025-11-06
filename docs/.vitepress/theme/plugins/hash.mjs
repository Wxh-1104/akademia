/**
 * 一个简单的、无依赖的字符串哈希函数。
 * 确保在 Node.js 和浏览器中为相同的输入生成相同的输出。
 * @param {string} str 要哈希的字符串
 * @returns {string} 一个简短的哈希字符串
 */
export function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // 转换为 32 位有符号整数
  }
  // 转换为一个更URL友好的字符串
  return new Uint32Array([hash])[0].toString(36);
}