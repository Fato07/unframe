import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background': 'rgb(0, 0, 0)',
        'blue': 'rgb(81, 47, 235)',
        'primary-text': 'rgb(255, 255, 255)',
        'secondary-text': 'rgba(255, 255, 255, 0.7)',
        'card-background': 'rgba(255, 255, 255, 0.06)',
        'border': 'rgba(255, 255, 255, 0.1)',
        'badge-color': 'rgb(13, 13, 13)',
        'cards-ui-1': 'rgba(255, 255, 255, 0.15)',
        'cards-ui-2': 'rgba(255, 255, 255, 0.12)',
        'cards-blue-accent': 'rgba(81, 47, 235, 0.7)',
        'cards-card-text': 'rgba(255, 255, 255, 0.8)',
        'cards-card-lines': 'rgba(255, 255, 255, 0.2)',
        'cards-ui-3': 'rgba(255, 255, 255, 0.2)',
        'dark': 'rgb(49, 49, 49)',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'inter-bold': ['Inter-Bold', 'sans-serif'],
        'inter-semibold': ['Inter-SemiBold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
