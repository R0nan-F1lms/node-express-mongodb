// eslint.config.js
import globals from "globals";

export default [
  {
    files: ["**/*.js"], // Apply rules to all .js files
    languageOptions: {
      ecmaVersion: "latest",   // Support modern JavaScript
      sourceType: "module",  // For require/module.exports
      globals: {
        ...globals.node, // Node.js built-ins (console, process, etc.)
        ...globals.jest,  // Jest globals (describe, it, expect, afterAll)
      },
    },
    rules: {
      // ✅ Essential Best Practices
      "eqeqeq": "error",             // Force ===/!== instead of ==/!=
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",           // Allow console.log for debugging/logging
      "curly": "error",              // Require curly braces in if/else/etc
      "no-undef": "error",           // Prevent undeclared variables
      "no-var": "error",             // Forbid var
      "prefer-const": "warn",        // Suggest const if not reassigned

      // 📏 Code Style & Readability
      "semi": ["error", "always"],   // Require semicolons
      "quotes": ["error", "double"], // Enforce double quotes
      "indent": ["error", 2],        // 2 spaces indentation
      "max-len": ["warn", { "code": 120 }],
      "comma-dangle": ["warn", "always-multiline"],

      // 🛡️ Error Prevention
      "consistent-return": "warn",
      "no-prototype-builtins": "error",
      "callback-return": "warn",
      "handle-callback-err": "warn",

      // 🔐 Security & Node.js Specific
      "no-eval": "error",
      "no-new-func": "error",
      "no-path-concat": "error",
      "no-buffer-constructor": "error",
    },
  },
];
