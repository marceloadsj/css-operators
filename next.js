const path = require("path");

function parseRule(rule) {
  if (!String(rule.test).includes("module")) return;

  if (Array.isArray(rule.use)) {
    const index = rule.use.findIndex(
      (use) => use.loader && String(use.loader).includes("css-loader")
    );

    if (index > -1) {
      rule.use.splice(index, 0, path.resolve(__dirname, "./webpack.js"));
    }
  }
}

module.exports = function next(config) {
  config.module.rules.forEach((rule) => {
    parseRule(rule);

    if (rule.oneOf) rule.oneOf.forEach(parseRule);
  });

  return config;
};
