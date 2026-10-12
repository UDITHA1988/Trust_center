import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17221f",
        paper: "#f7f8f5",
        moss: "#28634d",
        lime: "#d6f064",
        line: "#e5e9e3"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"]
      },
      boxShadow: {
        lift: "0 20px 70px rgba(28, 45, 37, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
