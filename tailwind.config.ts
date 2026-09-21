import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
          foreground: "var(--color-secondary-foreground)",
        },
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
          950: "var(--color-neutral-950)",
        },
        semantic: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          error: "var(--color-error)",
          info: "var(--color-info)",
        },
        status: {
          draft: "var(--color-status-draft)",
          review: "var(--color-status-review)",
          published: "var(--color-status-published)",
          archived: "var(--color-status-archived)",
        },
        brand: {
          teal: {
            DEFAULT: "#0D5C4D",
            dark: "#1A4B43",
            light: "#E8F5F2",
          },
          terracotta: {
            DEFAULT: "#D96B27",
            dark: "#C85A17",
            light: "#FDF2EB",
          },
          gold: {
            DEFAULT: "#E5A823",
            light: "#FEF7E8",
          },
          slate: {
            DEFAULT: "#2B8282",
            light: "#EBF6F6",
          },
        },
        surface: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          muted: "var(--bg-muted)",
          accent: "var(--bg-accent)",
          inverse: "var(--bg-inverse)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        container: "var(--container-max-width)",
        reading: "var(--container-reading-width)",
      },
      transitionDuration: {
        micro: "var(--motion-duration-micro)",
        normal: "var(--motion-duration-normal)",
        macro: "var(--motion-duration-macro)",
      },
    },
  },
  plugins: [typography],
};

export default config;
