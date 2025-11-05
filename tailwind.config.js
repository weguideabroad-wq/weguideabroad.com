/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:      "#F2EFE7", // background cream
        card:    "#E2E7D2", // section cards
        olive:   "#6F7D48", // primary button
        olivedk: "#556235", // hover/dark
        text:    "#1A1A1A", // main text
        border:  "#D9D9D2", // subtle borders
      },
    },
  },
  plugins: [],
}
