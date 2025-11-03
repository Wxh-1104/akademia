---
sidebar: false
layoutClass: wide-page-layout
license: CC-BY-NC-SA-4.0
---

# 功能实验室

以下功能正在测试中，欢迎报告漏洞及提出宝贵意见！

## 导航卡片

Rust 语言相关：

<NavCardGrid :columns="5">
  <NavCard
    title="Rust 程序设计语言"
    description="社区支持的最新版 Rust 标准教科书"
    link="https://rust-exercises.com/100-exercises/"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
  <NavCard
    title="100 Exercises"
    description="通过 100 道练习从零学习 Rust"
    link="https://rust-exercises.com/100-exercises/"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
  <NavCard
    title="Comprehensive Rust🦀"
    description="由 Android 团队开发，每节均配备练习"
    link="https://google.github.io/comprehensive-rust/zh-CN/index.html"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
  <NavCard
    title="Rust Cookbook"
    description="通过代码实例展示 Rust 生态系统的一角"
    link="https://play.rust-lang.org/"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
  <NavCard
    title="Rust 参考手册"
    description="对教科书的补充，适合有语言基础者"
    link="https://rust-exercises.com/100-exercises/"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
  <NavCard
    title="The Rustonomicon"
    description="对参考手册的补充，适合有语言基础者"
    link="https://doc.rust-lang.org/nomicon/"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
  <NavCard
    title="Effective Rust"
    description="进一步精进 Rust 代码能力"
    link="https://www.lurklurk.org/effective-rust/title-page.html"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
  <NavCard
    title="Rust 宏小册"
    description="深入理解 Rust 宏，适合有语言基础者"
    link="https://zjp-cn.github.io/tlborm/"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
  <NavCard
    title="Rand Book"
    description="对 Rand 库的详细介绍，适合快速上手"
    link="https://rust-random.github.io/book/intro.html"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
  <NavCard
    title="Rust Playground"
    description="线上编译运行 Rust 代码的好去处"
    link="https://play.rust-lang.org/"
    colorLight="#eb864c"
    colorDark="#dea584"
  />
</NavCardGrid>

AI 相关：

<NavCardGrid :columns="4">
  <NavCard
    title="Google AI Studio"
    description="访问最新的 Gemini 大模型（大部分无限额）"
    link="https://aistudio.google.com/prompts/new_chat"
    colorLight="#346bf1"
    colorDark="#4fa0ff"
  />
  <NavCard
    title="ChatGPT"
    description="访问 ChatGPT（有使用限额）"
    link="https://chatgpt.com/"
    colorLight="#676767"
    colorDark="#ddd"
  />
  <NavCard
    title="Microsoft Copilot"
    description="访问 Copilot（有使用限额）"
    link="https://copilot.microsoft.com/"
    colorLight="rgb(202, 125, 54)"
    colorDark="rgb(253, 213, 182)"
  />
  <NavCard
    title="deepseek"
    description="访问 deepseek（无使用限额）"
    link="https://chat.deepseek.com/"
    colorLight="#2563eb"
    colorDark="#a4b9e8"
  />
  <NavCard
    title="RethinkFun 深度学习"
    description="内容浅显，讲解细致，适合有 Python 基础者学习"
    link="https://www.rethink.fun/"
    colorLight="rgb(33, 150, 243)"
    colorDark="#b3d4fc"
  />
  <NavCard
    title="Google 机器学习教育"
    description="贴近实操，适合有 Python 基础者学习"
    link="https://developers.google.com/machine-learning?hl=zh-cn"
    colorLight="rgb(33, 150, 243)"
    colorDark="#b3d4fc"
  />
  <NavCard
    title="动手学深度学习"
    description="内容全面，适合有 Python 基础者学习"
    link="https://zh.d2l.ai/"
    colorLight="rgb(33, 150, 243)"
    colorDark="#b3d4fc"
  />
  
</NavCardGrid>

其他编程语言：

<NavCardGrid :columns="4">
  <NavCard
    title="现代 Javascript 教程"
    description="内容较为全面且紧跟前沿标准"
    link="https://zh.javascript.info/"
    colorLight="#602620"
    colorDark="#e3796a"
  />
</NavCardGrid>

## Markdown 编辑器

可以在下面自由编辑 Markdown。

> [!WARNING] 本网页编辑器无法确保你的输入不会丢失，因此请及时将结果备份。

<ClientOnly>
  <MarkdownPlayground title="Akademia Markdown 编辑器" />
</ClientOnly>

## Gemini 对话框

下面是通过 API 密钥实现与 Gemini 对话的会话框：

<GeminiChat />
