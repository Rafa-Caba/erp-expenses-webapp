module.exports = {
    root: true,
    env: { browser: true, es2022: true },
    extends: ["eslint:recommended", "plugin:react-hooks/recommended", "prettier"],
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    plugins: ["react-refresh"],
    rules: {
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
    }
};