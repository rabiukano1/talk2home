const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'mjs' to the list of resolved extensions so lucide-react-native works
config.resolver.sourceExts.push('mjs');

module.exports = config;
