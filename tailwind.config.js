/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#050b1a",
          900: "#0b1530",
          800: "#122447",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(45,212,191,0.2), 0 10px 35px rgba(45,212,191,0.2)",
      },
    },
  },
  plugins: [],
};
