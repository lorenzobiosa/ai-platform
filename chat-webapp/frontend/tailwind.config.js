
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          500: '#3b82f6',      // nuovo: tono più chiaro per hover
          600: '#2563eb',      // bottone/login (colore base dei link)
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        'xl-strong': '0 20px 60px -20px rgba(30,64,175,.5)',
      },
    },
  },
  plugins: [],
};