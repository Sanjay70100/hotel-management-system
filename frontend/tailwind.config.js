/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      colors: {
        hotel: {
          primary: "#2563EB",
          secondary: "#0F172A",
          background: "#F8FAFC",
          surface: "#FFFFFF",
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626",
        },
      },

      boxShadow: {
        dashboard: "0 4px 20px rgba(15, 23, 42, 0.05)",
      },

      borderRadius: {
        dashboard: "14px",
      },
    },
  },

  plugins: [],
};