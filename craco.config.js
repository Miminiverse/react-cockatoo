const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@root": path.resolve(__dirname, "src/"),
      "@asset": path.resolve(__dirname, "src/asset"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@forms": path.resolve(__dirname, "src/forms"),
    }
  }
};