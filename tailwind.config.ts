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

        /* App Theme - Calm & Trustworthy */
        appBg: '#f0f4f8', // Soft blue-gray background (calming)
        appSurface: '#ffffff', // Pure white cards/surfaces
        appText: '#1e293b', // Dark slate text (readable)
        appMuted: '#64748b', // Medium slate for secondary text
        appBorder: '#cbd5e1', // Light slate borders

        /* Action Colors */
        appPrimary: '#2563eb', // Professional blue (trust & action)
        appPrimaryHover: '#1d4ed8', // Darker blue for hover
        appPrimaryLight: '#dbeafe', // Light blue for subtle highlights

        /* Status Colors */
        success: '#059669', // Green for success states
        successLight: '#d1fae5', // Light green background
        danger: '#dc2626', // Red for errors/warnings
        dangerLight: '#fee2e2', // Light red background
        warning: '#f59e0b', // Amber for warnings
        warningLight: '#fef3c7', // Light amber background

        /* Agency Branding */
        apaxhub: '#70ffef', // Your signature teal/cyan
        apaxhubDark: '#0ea5e9', // Darker variant for links
      },
      boxShadow: {
        glow: '0 0 20px rgba(112, 255, 239, 0.35)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        cardHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
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
