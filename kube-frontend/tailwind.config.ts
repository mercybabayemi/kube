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
          // ROLE-BASED TOKENS (stable naming)
          primary: '#2E1F4F',
          'primary-mid': '#3D3557',
          'primary-light': '#5B4A7A',

          accent: '#C86A2B',
          'accent-light': '#D4935A',
          'accent-dark': '#A75A24',

          light: '#EEEAE4',
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
          'linear-gradient(135deg, #2E1F4F 0%, #3D3557 100%)',

        'kube-accent-gradient':
          'linear-gradient(135deg, #C86A2B 0%, #D4935A 100%)',
      },
    },
  },
  plugins: [],
}

export default config
