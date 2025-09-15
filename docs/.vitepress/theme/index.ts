import DefaultTheme from 'vitepress/theme'

import "./style/index.css";

import MyLayout from './Layout.vue'

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

import audioPlayer from './components/audioPlayer.vue'

import CcLicense from './components/ccLicense.vue'


export default {
  ...DefaultTheme,
  
  Layout: MyLayout,

  enhanceApp({ app }) {
    app.component("Icon", EnhancedIcon);
    app.component('MarkdownPlayground', markdownPlayground)
    app.component('GeminiChat', geminiChat)
    app.component('AudioPlayer', audioPlayer)
    app.component('CcLicense', CcLicense)
  }
}
