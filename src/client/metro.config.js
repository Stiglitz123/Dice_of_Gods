const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, "../.."); // racine du projet

const config = getDefaultConfig(projectRoot);

// On ajoute "common" à la liste des dossiers surveillés par Metro
config.watchFolders = [path.resolve(workspaceRoot, "src/common")];

// On définit les alias pour Metro (pas pour TypeScript)
config.resolver.alias = {
  "@": path.resolve(projectRoot),
  "@common": path.resolve(workspaceRoot, "src/common"),
  "@assets": path.resolve(projectRoot, "assets"),
};

module.exports = config;
