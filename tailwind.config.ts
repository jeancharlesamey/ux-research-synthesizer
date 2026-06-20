import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#6366f1',
          600: '#4f46e5',
          900: '#1e293b',
        },
      },
    },
  },
  plugins: [],
};

export default config;
