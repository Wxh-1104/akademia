import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

import timeline from "vitepress-markdown-timeline";
import markdownItFootnote from 'markdown-it-footnote';
import markdownItTaskCheckbox from 'markdown-it-task-checkbox';

export default withMermaid(
  defineConfig({
    title: "Akademia",
    lang: 'zh-CN',
    description: "A VitePress Site",
    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ],
    themeConfig: {
      logo: {
        light: '/logo-light.svg', // 亮色模式下用深色 logo
        dark: '/logo-dark.svg'    // 暗色模式下用浅色 logo
      },

      nav: [
        { text: "首页", link: "/" },
        { text: "指引", link: "/guide/" },
        { text: "课业", link: "/schoolwork/" },
        { text: "教程", link: "/tutorial/" },
        { text: "杂谈", link: "/article/" },
        { text: "关于", link: "/about" },
        {
          text: "更多",
          items: [
            { text: "功能实验室", link: "/playground"},
            { text: "VitePress 官网", link: "https://vitepress.dev/" },
          ]
        }
      ],

      sidebar: {
        "/guide/": [
          { text: "指引篇：写在前面", link: "/guide/" },
          { text: "为什么是大学？", link: "/guide/why-university" },
          { text: "雾海漫游者", link: "/guide/wanderer-above-the-sea-of-fog" },
          { text: "展望未来", link: "/guide/looking-forward" },
        ],
        "/tutorial/": [
          {
            text: "学习生活",
            collapsed: false,
            items: [
              { text: "从成长到成才", link: "/tutorial/growth" },
              { text: "开始使用生成式人工智能", link: "/tutorial/genai" },
              { text: "向学长学姐请教", link: "/tutorial/getting-advice-from-senior" },
              { text: "保研那点儿事", link: "/tutorial/baoyan" },
            ],
          },
          {
            text: "计算机进阶",
            collapsed: false,
            items: [
              { text: "计算机科学概览", link: "/tutorial/cs-overview" },
              { text: "每个计算机科学专业的学生应该知道什么？", link: "/tutorial/cs-should-know" },
              { text: "缺失的计科课程", link: "/tutorial/missing-cs-course" },
              { text: "Python 入门", link: "/tutorial/python-tutorial" },
              { text: "NumPy 完全入门指南", link: "/tutorial/numpy" },
              { text: "Matrix Computations for Signal Processing翻译", link: "/tutorial/ee731-lecture-notes" },
              { text: "C++ 入门", link: "/tutorial/cpp-tutorial" }
            ]
          },
        ],
        "/schoolwork/": [
          { text: "课业篇：写在前面", link: "/schoolwork/" },
          { text: "专业课", link: "/schoolwork/major-courses" },
          {
            text: "大学英语",
            collapsed: false,
            items: [
              { text: "大学英语（1）", link: "/schoolwork/english/college-english-1" },
              { text: "大学英语（2）", link: "/schoolwork/english/college-english-2" },
              { text: "大学英语（3）", link: "/schoolwork/english/college-english-3" },
              { text: "大学英语（4）", link: "/schoolwork/english/college-english-4" },
            ]
          },
          {
            text: "大学数学",
            collapsed: false,
            items: [
              { text: "高等数学（1）", link: "/schoolwork/math/calculus-1" },
              { text: "高等数学（2）", link: "/schoolwork/math/calculus-2" },
              { text: "线性代数", link: "/schoolwork/math/linear-algebra" },
              { text: "概率论与数理统计", link: "/schoolwork/math/probability-and-statistics" },
            ]
          },
          {
            text: "思政课",
            collapsed: false,
            items: [
              { text: "思想道德与法治", link: "/schoolwork/sizheng/ideology-morality-and-rule-of-law" },
              { text: "马克思主义基本原理", link: "/schoolwork/sizheng/marxism-general-principle" },
              { text: "中国近现代史纲要", link: "/schoolwork/sizheng/essentials-of-chinese-modern-history" },
              { text: "毛泽东思想和中国特色社会主义理论体系概论", link: "/schoolwork/sizheng/fundamentals-of-mao-zedong-thoughts-and-socialism-with-chinese-characteristics" },
              { text: "习近平新时代中国特色社会主义思想概论", link: "/schoolwork/sizheng/introduction-to-xijinping-thought-on-socialism-with-chinese-characteristics-for-a-new-era" },
              { text: "形势与政策", link: "/schoolwork/sizheng/situation-and-policy" },
              { text: "劳动教育", link: "/schoolwork/sizheng/labor-education" },
              { text: "军事理论", link: "/schoolwork/sizheng/military-theory" },
              { text: "心理健康教育", link: "/schoolwork/sizheng/mental-health-education" },
            ]
          }
        ],
        "/article/": [
          { text: "杂谈首页", link: "/article/"},
          { text: "芥川龙之介", link: "/article/akutagawa" }
        ]
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/Wxh-1104/akademia' },
        {
          icon: {
            svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>QQ</title><path d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"/></svg>'
          },
          link: 'https://weixin.qq.com/',
          ariaLabel: 'QQ'
        }
      ],

      darkModeSwitchLabel: '深浅模式',
      sidebarMenuLabel: '目录',
      returnToTopLabel: '返回顶部',
      outline: {
        level: [2, 4],
        label: '当前页大纲'
      },
      lastUpdated: {
        text: '最后更新于',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'medium'
        }
      },
      docFooter: {
        prev: '上一页',
        next: '下一页'
      },
      search: { provider: 'local' },
    },

    base: '/',
    markdown: {
      math: true,
      image: { lazyLoading: true },
      config: (md) => {
        md.use(timeline)
        md.use(markdownItTaskCheckbox)
        md.use(markdownItFootnote)
      },
    },
    cleanUrls: true,
    ignoreDeadLinks: false,
    lastUpdated: true,
  })
)
