import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        fg: '#ffffff',
        primary: '#70ffef',
        muted: '#ffffff99',
        border: '#ffffff1f',
        surface: '#111111',

        /* App base */
        appBg: '#f8fafc', // slate-50
        appSurface: '#ffffff', // pure white
        appText: '#0f172a', // slate-900
        appMuted: '#475569', // slate-600
        appBorder: '#e2e8f0', // slate-200

        /* Status */
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
      },
      boxShadow: {
        glow: '0 0 20px rgba(112, 255, 239, 0.35)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        ibm: ['IBM Plex Sans', 'sans-serif'],
        inter_italic: ['Inter Italic', 'sans-serif'],
        ibm_italic: ['IBM Plex Sans Italic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
