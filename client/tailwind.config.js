// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // add paths to any other directories containing files where Tailwind classes are used
  ],
  theme: {
    extend: {
      colors: {
        "custom-gray": "#111827", // Add your custom color here
        "custom-red": "#881337", // Add your custom color here
      },
    },
  },
  plugins: [],
};
