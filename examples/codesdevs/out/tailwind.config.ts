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
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
