const path = require("path");

function parseRule(rule) {
  if (Array.isArray(rule.use)) {
    // the css-loader should be right after the operators one
    const index = rule.use.findIndex(
      (use) => use.loader && String(use.loader).includes("css-loader")
    );

    if (index > -1) {
      rule.use.splice(index, 0, path.resolve(__dirname, "./webpackLoader.js"));
    }
  }
}

module.exports = function injectOnWebpack(config) {
  config.module.rules
    // filter the rules that parses .module.css files
    .filter((rule) => "test.module.css".match(rule.test))

    .forEach((rule) => {
      // for each rule, parse it injecting the right config
      parseRule(rule);

      // for nested rules, try to parse them as well
      if (rule.oneOf) rule.oneOf.forEach(parseRule);
    });

  return config;
};
