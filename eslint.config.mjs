import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import eslintNextPlugin from '@next/eslint-plugin-next';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  // Ignore patterns (migrated from .eslintignore)
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'next-env.d.ts',
    'package-lock.json',
    'yarn.lock',
    '.env',
    '.env.local',
  ]),
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: {
      next: eslintNextPlugin,
    },
    rules: {
      'react/no-unescaped-entities': 0,
      '@next/next/no-page-custom-font': 0,
      'no-unused-vars': 2,
    },
  },
]);

export default eslintConfig;
