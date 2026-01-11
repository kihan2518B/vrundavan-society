import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        fg: "#ffffff",
        primary: "#70ffef",
        muted: "#ffffff99",
        border: "#ffffff1f",
        surface: "#111111",
      },
      boxShadow: {
        glow: "0 0 20px rgba(112, 255, 239, 0.35)",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        ibm: ["IBM Plex Sans", "sans-serif"],
        inter_italic: ["Inter Italic", "sans-serif"],
        ibm_italic: ["IBM Plex Sans Italic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
