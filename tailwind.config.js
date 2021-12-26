module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          primary: '#0095F6',
          secondary: '#00376b',
        },
        gray: {
          primary: '#8e8e8e',
          border: '#dbdbdb',
          bg: '#fafafa',
        },
        red: {
          primary: '#ee3341',
        },
      },
      screens: {
        xs: '480px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')],
};
