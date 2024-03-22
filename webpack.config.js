const path = require("path");

/* PLUGINS */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCSSExtractWebpackPugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCSSWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const CriticalCssWebpackPlugin = require("critical-css-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDevelopment = process.env.NODE_MODE === "development";
const isProduction = !isDevelopment;

/* Setup Dev Server for development on port: env.DEV_SERVER_PORT or 3000 */
const setupDevServer = () => {
  if (isDevelopment) {
    return {
      port: process.env.DEV_SERVER_PORT || 3000,
      compress: true,
      open: true,
    };
  }
};

/* Setup Optimization Webpack with Css, JS Minimizer on production */
const setupOptimization = () => {
  const defaultConfig = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProduction) {
    defaultConfig.minimizer = [
      new OptimizeCSSWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return defaultConfig;
};

/* List of css loaders  */
const cssLoaders = (extra) => {
  let loaders = [
    {
      loader: MiniCSSExtractWebpackPugin.loader,
      options: {
        publicPath: "",
      },
    },
    "css-loader",
    "postcss-loader",
  ];

  if (extra) {
    loaders = [...loaders, ...extra];
  }

  return loaders;
};

/* Setup Plugins with CriticalCssWebpackPlugin on production */
const setupPlugins = () => {
  let defaultPlugins = [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),

    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets"),
          to: path.resolve(__dirname, "dist/assets"),
        },
      ],
    }),
    new MiniCSSExtractWebpackPugin({
      filename: "index.css",
    }),
  ];

  return defaultPlugins;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isDevelopment ? "index.[contenthash].js" : "index.js",
  },
  mode: process.env.NODE_MODE,
  optimization: setupOptimization(),
  devServer: setupDevServer(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders([
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ]),
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: setupPlugins(),
};
