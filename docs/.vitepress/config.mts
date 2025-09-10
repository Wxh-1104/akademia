import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

import timeline from "vitepress-markdown-timeline";
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
        { text: '主页', link: '/' },
        { text: 'Examples', link: '/markdown-examples' }
      ],

      sidebar: [

        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ],
          collapsed: false
        }


      ],

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
        md.use(timeline);
        md.use(markdownItTaskCheckbox)
      },
    },
    cleanUrls: true,
    ignoreDeadLinks: false,
    lastUpdated: true,
  })
)
