import globals from "globals";  // ブラウザのグローバル変数をインポート
import pluginJs from "@eslint/js";  // ESLintのJavaScriptプラグインをインポート
import tsParser from "@typescript-eslint/parser";  // TypeScriptのパーサーをインポート
import path from "path";  // パスモジュールをインポート
import { fileURLToPath } from "url";  // URLモジュールをインポート
import { FlatCompat } from "@eslint/eslintrc";  // FlatCompatをインポート

// CommonJS変数をエミュレート（CommonJSを使用している場合は不要）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,  // ベースディレクトリを設定
});

export default [
  // JavaScriptの推奨設定を適用
  pluginJs.configs.recommended,
  // TypeScriptの推奨設定を適用
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    ignores: ["node_modules", "dist", "output", "tests", "src/types.d.ts"],  // 無視するパターン
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      },
      // ブラウザ環境のグローバル変数を定義
      globals: globals.browser
    },
    rules: {
      // constを優先して使用
      "prefer-const": [
        "error",
        {
          "destructuring": "any",
          "ignoreReadBeforeAssign": false
        }
      ],
      // 非同期関数でawaitが必要ない場合の警告をオフ
      "require-await": "off",
      // 非同期関数に対するawaitの警告をオン
      "@typescript-eslint/require-await": "warn",
      // == は禁止, === は許容
      "eqeqeq": "error",
      // 戻り値の型指定を省略
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // // 型がanyの使用を禁止
      // "@typescript-eslint/no-explicit-any": "off",
      // 命名規則の設定
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          // 変数に対する命名規則
          "selector": "variable",
          "format": ["strictCamelCase", "UPPER_CASE"],
          // 例：_leadingUnderscore
          "leadingUnderscore": "allow",
          // 例：trailingUnderscore_
          "trailingUnderscore": "allow"
        },
        {
          // 関数に対する命名規則
          "selector": "function",
          "format": ["strictCamelCase"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          // メソッドに対する命名規則
          "selector": "method",
          "format": ["strictCamelCase"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          // 型に対する命名規則
          "selector": "typeLike",
          "format": ["PascalCase"]
        },
        {
          // パラメータに対する命名規則
          "selector": "parameter",
          "format": ["strictCamelCase"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          // プロパティに対する命名規則
          "selector": "property",
          "format": ["strictCamelCase", "PascalCase", "snake_case"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          // パラメータプロパティに対する命名規則
          "selector": "parameterProperty",
          "format": ["strictCamelCase"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          // オブジェクトリテラルのプロパティに対する命名規則
          "selector": "objectLiteralProperty",
          "format": ["strictCamelCase", "snake_case"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          // クラスに対する命名規則
          "selector": "class",
          "format": ["StrictPascalCase"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          // インターフェースに対する命名規則
          "selector": "interface",
          "format": ["StrictPascalCase"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        }
      ],
      // Next.jsのimg要素の使用を許可
      "@next/next/no-img-element": "off",
      // alt属性の警告をオフ
      "jsx-a11y/alt-text": "off"
    }
  },
  {
    files: ['eslint.config.mjs'],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
  },
];
