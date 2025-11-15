const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        process: require.resolve("process/browser"),
      },
    },
  },
});

// const { defineConfig } = require("@vue/cli-service");
// const webpack = require("webpack");
// module.exports = defineConfig({
//   transpileDependencies: true,
//   plugins: [
//     new webpack.ProvidePlugin({
//       process: "process/browser",
//     }),
//   ],
// });
