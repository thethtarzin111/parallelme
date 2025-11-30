export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateX(-50%) translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateX(-50%) translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
   
    },
  },
  plugins: [],
}