/** @type {import('tailwindcss').Config} */
module.exports = {
  // purge: ["./index.html", "./src/**/*.{js.ts.jsx.tsx}"],
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { transform: "translateY(-10px) scale(.5)", opacity: "0" },
          "10%": { transform: "translateY(0px) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(0px) scale(1)", opacity: "1" },
          // "90%": { transform: "translateY(0px) scale(1)", opacity: "1" },
          // "100%": { transform: "translateY(-10px) scale(.5)", opacity: "0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 3s ease-in-out 1",
      },
    },
  },
  plugins: [],
};
