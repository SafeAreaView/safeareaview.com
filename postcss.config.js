const Autoprefixer = require("autoprefixer");
const PostcssPresetEnv = require("postcss-preset-env");
const ImmutableCss = require("immutable-css");

module.exports = {
  plugins: [Autoprefixer, PostcssPresetEnv, ImmutableCss],
};
