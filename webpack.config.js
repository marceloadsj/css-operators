const path = require("path");

module.exports = {
  watch: true,

  watchOptions: {
    ignored: ["node_modules/**", "dist/**"],
  },

  module: {
    rules: [
      {
        test: /\.module.css$/i,
        use: [
          "style-loader",
          path.resolve("./webpackLoader.js"),
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("./postcssPlugin.js"),
                  require("postcss-nested"),
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
