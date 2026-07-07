import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["jest.config.js", "scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Docusaurus docs
    "docs/**",
    // node_modules (raiz e apps do monorepo)
    "node_modules/**",
    "apps/**/node_modules/**",
    // builds das apps
    "apps/**/.next/**",
    "apps/**/out/**",
    "apps/**/build/**",
    "apps/**/dist/**",
  ]),
]);

export default eslintConfig;
