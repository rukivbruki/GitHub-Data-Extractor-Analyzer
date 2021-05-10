module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "max-depth": ["error", 3],
    complexity: ["error", 2],
  },
  parser: "babel-eslint",
};
