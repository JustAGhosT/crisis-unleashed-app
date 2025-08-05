import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Crisis Unleashed faction colors
        faction: {
          solaris: {
            primary: "#FFD700",
            secondary: "#FFA500",
            accent: "#FF6347",
          },
          umbral: {
            primary: "#8A2BE2",
            secondary: "#4B0082",
            accent: "#9370DB",
          },
          aeonic: {
            primary: "#00CED1",
            secondary: "#20B2AA",
            accent: "#48D1CC",
          },
          primordial: {
            primary: "#32CD32",
            secondary: "#228B22",
            accent: "#00FF7F",
          },
          infernal: {
            primary: "#DC143C",
            secondary: "#B22222",
            accent: "#FF1493",
          },
          neuralis: {
            primary: "#00BFFF",
            secondary: "#1E90FF",
            accent: "#87CEEB",
          },
          synthetic: {
            primary: "#C0C0C0",
            secondary: "#808080",
            accent: "#A9A9A9",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px currentColor" },
          "50%": { boxShadow: "0 0 20px currentColor" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;