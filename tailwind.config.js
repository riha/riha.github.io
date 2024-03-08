const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./_drafts/**/*.html",
    "./_includes/**/*.html",
    "./_layouts/**/*.html",
    "./_posts/*.md",
    "./*.md",
    "./*.html",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: colors.white,
      bg: {
        yellow: colors.yellow[50],
        light: colors.white,
        dark: colors.gray[700],
      },

      profile: {
        border: colors.yellow[100],
      },
      text: {
        light: colors.gray[50],
        DEFAULT: colors.gray[800],
        subtle: colors.gray[500],
      },
    },

    extend: {},
  },
  plugins: [],
};
