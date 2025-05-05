/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'dark-blue': '#00305C',
          'dark-blue-2': '#003E75', 
          'light-blue': '#0093C7',
          'light-blue-2': '#009DE0',
          'def-grey': '#58595B',
          primary: {
            DEFAULT: 'var(--primary-color, #00305C)',
            light: 'var(--primary-color-light, #4d80b3)',
            dark: 'var(--primary-color-dark, #002040)',
          },
          secondary: {
            DEFAULT: 'var(--secondary-color, #0093C7)',
            light: 'var(--secondary-color-light, #99c2ff)',
            dark: 'var(--secondary-color-dark, #3385ff)',
          },
          accent: {
            DEFAULT: 'var(--accent-color, #009DE0)',
            light: 'var(--accent-color-light, #ffb84d)',
            dark: 'var(--accent-color-dark, #cc7a00)',
          },
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['Roboto Mono', 'monospace'],
        },
      },
    },
    plugins: [],
  }