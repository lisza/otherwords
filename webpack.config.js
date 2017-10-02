module.exports = {
    entry: "./lib/main.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devtool: "source-map",
    resolve: {
    extensions: [".js", ".json", "*"]
  },
    target: "node"
};
