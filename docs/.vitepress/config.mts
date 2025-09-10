import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

import timeline from "vitepress-markdown-timeline";
import markdownItFootnote from 'markdown-it-footnote';
import markdownItTaskCheckbox from 'markdown-it-task-checkbox';


// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: "Akademia",
    lang: 'zh-CN',
    description: "A VitePress Site",
    themeConfig: {
      logo: '',

      nav: [
        { text: "首页", link: "/" },
        { text: "指引", link: "/guide/" },
        { text: "课业", link: "/schoolwork/" },
        { text: "教程", link: "/tutorial/" },
        { text: "关于", link: "/about" },
        {
          text: "更多",
          items: [
            { text: "外部链接示例", link: "https://vitepress.dev/" },
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
              { text: "从成长到成才", link: "/guide/growth" },
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
              { text: "Python入门", link: "/tutorial/python-tutorial" },
              { text: "NumPy完全入门指南", link: "/tutorial/numpy" },
              { text: "Matrix Computations for Signal Processing翻译", link: "/tutorial/ee731-lecture-notes" },
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
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
        {
          icon: {
            svg: ''
          },
          link: '',
          ariaLabel: ''
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
