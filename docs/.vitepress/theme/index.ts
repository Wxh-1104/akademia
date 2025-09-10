import DefaultTheme from 'vitepress/theme'

import "./style/index.css";

import "vitepress-markdown-timeline/dist/theme/index.css";

import { h } from "vue";
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

export default {
  ...DefaultTheme,

  enhanceApp({ app }) {
    app.component("Icon", EnhancedIcon);
  },
}