/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C1121F",
          light: "#E63946",
          dark: "#780000",
        },
        secondary: {
          DEFAULT: "#111111",
          light: "#222222",
          dark: "#000000",
        },
        accent: {
          DEFAULT: "#FFD700",
          light: "#FFE033",
          dark: "#B89B00",
        },
        cinemaBg: "#F5F5F5",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}
