module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderRadius: {
        egg: '50%/60% 60% 40% 40%',
      },
      boxShadow: {
        egg: '12px 16px 12px 12px rgba(238, 203, 62, 0.9)',
      },
      colors: {
        yellow: {
          250: '#FDE66C',
        },
      },
      inset: {
        '1/6': '16.666666%',
        '1/12': '8.333333%',
      },
      rotate: {
        30: '30deg',
      },
      keyframes: {
        walk: {
          '0%, 50%, 100%': { transform: 'translateX(0%)' },
          '25%': { transform: 'translateX(-20%)' },
          '75%': { transform: 'translateX(20%)' },
        },
      },
      animation: {
        walk: 'walk 5s steps(5) infinite',
      },
    },
  },
  variants: {
    extend: {
      scale: ['active'],
    },
  },
  plugins: [],
};
