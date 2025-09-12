import DefaultTheme from 'vitepress/theme'

import "./style/index.css";

import "vitepress-markdown-timeline/dist/theme/index.css";

import { h } from "vue";
import { useData } from 'vitepress';
import { Icon as OriginalIcon, addAPIProvider } from "@iconify/vue";

addAPIProvider("iconify", {
  resources: ["https://api.iconify.design"],
});

const EnhancedIcon = {
  props: ["icon", "href", "color"],
  setup(props, { attrs }) {
    return () => {
      const iconAttrs = { ...attrs, icon: props.icon };
      if (props.color === "brand") {
        iconAttrs.class = [attrs.class, "text-brand"].filter(Boolean).join(" ");
      }
      const iconNode = h(OriginalIcon, iconAttrs);
      if (props.href) {
        return h(
          "a",
          {
            class: "icon-link-wrapper",
            href: props.href,
            target: "_blank",
            rel: "noopener noreferrer",
          },
          [iconNode]
        );
      }
      return iconNode;
    };
  },
};

// 自定义组件区

import 'highlight.js/styles/github.css'
import markdownPlayground from "./components/markdownPlayground.vue"

import geminiChat from './components/geminiChat.vue'

export default {
  ...DefaultTheme,

  enhanceApp({ app }) {
    app.component("Icon", EnhancedIcon);
    app.component('MarkdownPlayground', markdownPlayground)
    app.component('GeminiChat', geminiChat)
  },

  Layout: () => {
    const props: Record<string, any> = {}
    // 获取 frontmatter
    const { frontmatter } = useData()

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass
    }

    return h(DefaultTheme.Layout, props)
  },
}

