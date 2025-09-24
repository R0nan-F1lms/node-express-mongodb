export default [
  {
    files: ["**/*.js"], // Apply these rules to all .js files
    languageOptions: {
      ecmaVersion: "latest",   // Support modern JavaScript syntax
      sourceType: "commonjs",  // For require/module.exports
      globals: { node: true }  // Enable Node.js globals like __dirname, process, etc.
    },
    rules: {
      // ✅ Essential Best Practices
      "eqeqeq": "error",             // Force ===/!== instead of ==/!= (avoids type coercion bugs)
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], 
                                     // Warn on unused variables (but allow _prefix for intentional ignores)
      "no-console": "off",           // Allow console.log (useful for server logging)
      "curly": "error",              // Require curly braces around blocks (e.g., if/else)
      "no-undef": "error",           // Disallow use of undeclared variables
      "no-var": "error",             // Forbid var (use let/const instead)
      "prefer-const": "warn",        // Suggest const if a variable isn’t reassigned

      // 📏 Code Style & Readability
      "semi": ["error", "always"],   // Enforce semicolons at end of statements
      "quotes": ["error", "double"], // Enforce double quotes for strings
      "indent": ["error", 2],        // Enforce 2-space indentation
      "max-len": ["warn", { "code": 120 }], 
                                     // Warn if a line exceeds 120 characters
      "comma-dangle": ["error", "always-multiline"], 
                                     // Require trailing commas for multiline objects/arrays (cleaner diffs)

      // 🛡️ Error Prevention
      "no-magic-numbers": ["warn", { "ignore": [0,1,-1] }],
                                     // Warn on unexplained numbers (e.g., status codes should be named constants)
      "consistent-return": "error",  // Require functions to return consistently (no mixing undefined and values)
      "no-prototype-builtins": "error", 
                                     // Forbid unsafe usage of hasOwnProperty, etc. directly on objects
      "callback-return": "warn",     // Enforce that callbacks are returned properly in async code
      "handle-callback-err": "warn", // Ensure errors are handled in callbacks (important in Node.js)

      // 🔐 Security & Node.js Specific
      "no-eval": "error",            // Disallow eval() (dangerous, security risk)
      "no-new-func": "error",        // Disallow Function constructor (similar to eval, security risk)
      "no-path-concat": "error",     // Disallow string concatenation for paths (use path.join instead)
      "no-buffer-constructor": "error" 
                                     // Disallow new Buffer() (deprecated, unsafe, prefer Buffer.from)
    }
  }
];