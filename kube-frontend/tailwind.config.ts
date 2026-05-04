import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kube: {
          // ROLE-BASED TOKENS
          primary: '#2E1F4F',
          'primary-mid': '#3D3557',
          'primary-light': '#5B4A7A',
          'primary-soft': '#F5F3F7',
          'primary-pale': '#FAF9FB',

          accent: '#C86A2B', // Restored orange
          'accent-light': '#D4935A',
          'accent-dark': '#A75A24',

          // Vibrant variants for "life"
          blue: '#3B82F6',
          pink: '#EC4899',
          green: '#10B981',

          light: '#F8F7F9',
          white: '#FFFFFF',

          success: '#1A7A4A',
          warning: '#B45309',
          error: '#B91C1C',
          muted: '#6B6680',
        },
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      backgroundImage: {
        'kube-gradient':
          'linear-gradient(135deg, #2E1F4F 0%, #5B4A7A 100%)',

        'kube-accent-gradient':
          'linear-gradient(135deg, #C86A2B 0%, #D4935A 100%)',
      },
    },
  },
  plugins: [],
}

export default config
