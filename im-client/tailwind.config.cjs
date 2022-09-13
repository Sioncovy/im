/** @type {import('tailwindcss').Config} */
module.exports = {
  // purge: ["./index.html", "./src/**/*.{js.ts.jsx.tsx}"],
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        // "login-side": "",
      },
    },
  },
  plugins: [],
};
