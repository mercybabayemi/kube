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
          // Brand colors from client logo images
          orange:         '#C17534',  // Primary accent — "ube" in both logos
          'orange-light': '#D4935A',  // Hover
          'orange-dark':  '#A0612A',  // Active / pressed
          purple:         '#2E1F4F',  // Dark bg — image 2 backdrop
          'purple-mid':   '#3D3557',  // "K" in light logo
          'purple-light': '#5B4A7A',  // Hover for purple elements
          cream:          '#EEEAE4',  // Light bg — image 1 backdrop
          white:          '#FFFFFF',  // Text on dark backgrounds
          // UI utility
          success:        '#1A7A4A',
          warning:        '#B45309',
          error:          '#B91C1C',
          muted:          '#6B6680',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'kube-gradient':        'linear-gradient(135deg, #2E1F4F 0%, #3D3557 100%)',
        'kube-orange-gradient': 'linear-gradient(135deg, #C17534 0%, #D4935A 100%)',
      },
    },
  },
  plugins: [],
}

export default config
