const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// The shared `tag` package is linked locally and lives outside the mobile
// project root, so Metro must watch it to resolve and transpile its TS source.
config.watchFolders = [path.resolve(__dirname, "../tag")];

module.exports = withNativeWind(config, { input: "./global.css" });
