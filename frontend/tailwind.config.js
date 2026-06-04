/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sk: {
          purple: "#A200BB",
          "purple-deep": "#7B0091",
          "purple-light": "#C44FE0",
          pink: "#FF6B9D",
          "pink-light": "#FF8FB1",
        },
        surface: {
          primary: "#0A0A0F",
          secondary: "#111118",
          card: "#1A1A26",
          hover: "#222230",
        },
        txt: {
          primary: "#EEEEF2",
          secondary: "#9B9BB0",
          muted: "#5E5E75",
          accent: "#D580FF",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      animation: {
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.6s ease both",
        float: "float 25s linear infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "typing-1": "typingBounce 1.4s ease-in-out infinite",
        "typing-2": "typingBounce 1.4s ease-in-out 0.15s infinite",
        "typing-3": "typingBounce 1.4s ease-in-out 0.3s infinite",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(25px, -35px) scale(1.04)" },
          "50%": { transform: "translate(-15px, 15px) scale(0.96)" },
          "75%": { transform: "translate(10px, 25px) scale(1.02)" },
        },
        pulseDot: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)" },
          "50%": { boxShadow: "0 0 0 5px rgba(34, 197, 94, 0)" },
        },
        typingBounce: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.3" },
          "30%": {
            transform: "translateY(-8px)",
            opacity: "1",
            backgroundColor: "#A200BB",
          },
        },
      },
    },
  },
  plugins: [],
};
