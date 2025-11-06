/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:      "#F2EFE7",
        card:    "#E2E7D2",
        olive:   "#6F7D48",
        olivedk: "#556235",
        text:    "#1A1A1A",
        border:  "#D9D9D2",
      },
    },
  },
  plugins: [],
}
