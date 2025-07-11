// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#1E40AF",    // Deep blue
        accent: "#3B82F6",     // Lighter blue
        muted: "#64748B",      // Slate
      },
    },
  },
  plugins: [],
};
