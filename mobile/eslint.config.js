// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    settings: {
      "import/ignore": ["\\.css$", "react-native"],
    },
    rules: {
      // react-native ships Flow-typed source that eslint-plugin-import cannot
      // parse, so namespace analysis on it is disabled.
      "import/namespace": "off",
    },
  },
]);
