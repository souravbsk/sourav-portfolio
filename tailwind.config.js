/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        site: "url('./src/assets/site-bg.jpg')",
      },
      colors:{
        primary:"#0f0826",
        secondary:"#7000ff"
      }
    },
  },
  plugins: [require("daisyui")],

};
