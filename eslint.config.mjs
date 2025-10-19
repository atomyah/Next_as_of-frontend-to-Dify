import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  //ESLintエラーの解消のため、ignoresセクションを追加
  {
    ignores: [
      "src/generated/**/*",
      "**/generated/**/*",
      "**/*.min.js",
      "node_modules/**/*",
      ".next/**/*",
      "out/**/*",
      "dist/**/*"
    ],
  },  
];

export default eslintConfig;
