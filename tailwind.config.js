/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "red-logo": "#d92323",
      },
      fontFamily: {
        sans: "Montserrat, monospace",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
