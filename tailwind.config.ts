import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f0f9ff',
          '100': '#e1f2fd',
          '200': '#bbe5fc',
          '300': '#80d1f9',
          '400': '#3cb9f4',
          '500': '#13a1e4',
          '600': '#0681c3',
          '700': '#066195',
          '800': '#0a5782',
          '900': '#0e486c',
          '950': '#092e48',
        }
      },
      backgroundImage: {
        auth: 'url(\'@/assets/bg.auth.svg\')',
      }
    },
  },
  plugins: [],
} satisfies Config;

