/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./assets/**/*.js"
  ],
  theme: {
    extend: {
      animation: {
        'pulse-indigo': 'pulse-indigo 2s infinite',
        'fadeIn': 'fadeIn 0.3s ease',
        'fadeInChart': 'fadeInChart 0.3s ease'
      },
      keyframes: {
        'pulse-indigo': {
          '0%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(99, 102, 241, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' }
        },
        'fadeIn': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'fadeInChart': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}
