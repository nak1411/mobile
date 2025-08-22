const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Disable the problematic screen capture observer
config.resolver.platforms = ["native", "android", "ios", "web"];

module.exports = config;
