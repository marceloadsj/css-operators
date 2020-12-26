module.exports = function postcssPlugin() {
  return {
    postcssPlugin: "postcss-css-operators",

    Once(root) {
      root.walkRules((rule) => {
        if (rule.parent === root) return;

        rule.selectors = rule.selectors.map((selector) => {
          if (!selector.startsWith("(") || !selector.endsWith(")")) {
            return selector;
          }

          let parentRule = rule.parent;

          while (
            parentRule.parent !== root &&
            !parentRule.parent.selector.includes(":global")
          ) {
            parentRule = parentRule.parent;
          }

          const parsedSelector = selector
            .replace(/\(/g, "")
            .replace(/\)/g, "")
            .replace("!=", "\\!=")
            .replace("<=", "\\<=")
            .replace(">=", "\\>=")
            .replace("=", "\\=")
            .replace("<", "\\<")
            .replace(">", "\\>")
            .replace(/ /g, "");

          return `&${parentRule.selector}\\|${parsedSelector}`;
        });
      });
    },
  };
};

module.exports.postcss = true;
