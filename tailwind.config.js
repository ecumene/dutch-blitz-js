/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Merriweather", "serif"],
      cursive: ["UnifrakturCook", "cursive"],
    },
    fontWeight: {
      // Add the specific weights you are using from Merriweather
      normal: "400",
      medium: "500",
      bold: "700",
      extrabold: "900",
    },
  },
  plugins: [],
};
