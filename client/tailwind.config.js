/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // add paths to any other directories containing files where Tailwind classes are used
  ],
  theme: {
    extend: {
      colors: {
        "custom-gray": "#111827",
        "custom-red": "#881337",
      },
      animation: {
        "custom-bounce-1": "custom-bounce-1 5s infinite", // Correctly linked keyframe
        "custom-bounce-2": "custom-bounce-2 5s infinite", // Correctly linked keyframe
      },
      keyframes: {
        "custom-bounce-1": {
          "0%, 100%": {
            transform: "translateY(-10px)", // Adjust height of the bounce here
            animationTimingFunction: "ease-in-out",
          },
          "50%": {
            transform: "translateY(0px)",
            animationTimingFunction: "ease-in-out",
          },
        },
        "custom-bounce-2": {
          "0%, 100%": {
            transform: "translateY(0px)",
            animationTimingFunction: "ease-in-out",
          },
          "50%": {
            transform: "translateY(-20px)", // Adjust height of the bounce here
            animationTimingFunction: "ease-in-out",
          },
        },
      },
    },
  },
  plugins: [],
};

