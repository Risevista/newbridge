import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';
import tailwind from "eslint-plugin-tailwindcss";


export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  ...eslintPluginAstro.configs['flat/recommended'],
  ...tailwind.configs["flat/recommended"],
  {
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "tailwindcss/no-custom-classname": "off"
    },
  }
];