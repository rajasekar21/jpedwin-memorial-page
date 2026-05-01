import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f3ed',
        ink: '#262421',
        linen: '#ebe3d7',
        clay: '#9a7864',
        cedar: '#4f6f64',
        gold: '#b4935a',
        twilight: '#161a22'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif']
      },
      boxShadow: {
        soft: '0 20px 80px rgba(38, 36, 33, 0.10)'
      }
    }
  },
  plugins: []
};

export default config;
