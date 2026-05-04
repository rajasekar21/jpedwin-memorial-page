import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#B57EDC',
        ink: '#271f3d',
        linen: '#d8b7f0',
        clay: '#7655a6',
        cedar: '#5e6fa8',
        gold: '#b986e8',
        twilight: '#171225'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif']
      },
      boxShadow: {
        soft: '0 20px 80px rgba(39, 31, 61, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
