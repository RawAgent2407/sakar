import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/admin/**/*.{js,ts,jsx,tsx,mdx}', // Added for admin panel
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-bricolage-grotesque)'],
        heading: ['var(--font-nunito-sans)'],
        body: ['var(--font-bricolage-grotesque)'],
      },
    },
  },
  plugins: [],
};

export default config;
