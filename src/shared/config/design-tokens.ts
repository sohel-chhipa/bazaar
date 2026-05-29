/** Design tokens aligned with the shared Tailwind palette. */
export const rawColors = {
  black: {
    800: "#000000",
    700: "#171717",
    600: "#232323",
    500: "#313131",
    400: "#626262",
    300: "#939393",
    200: "#c4c4c4",
    100: "#f0f0f0",
  },
  grey: {
    600: "#eeede9",
    400: "#ebebeb",
    200: "#f7f7f7",
    100: "#ffffff",
  },
  green: {
    600: "#0e7138",
    500: "#3c8b5e",
    400: "#6aa684",
  },
  red: {
    600: "#cb1b39",
    500: "#d3475f",
    100: "#f0dfe2",
  },
  yellow: {
    800: "#c19700",
    600: "#fec84b",
  },
  blue: {
    800: "#152155",
    600: "#0057e6",
    500: "#2b71e3",
    100: "#dce5f3",
  },
  foundation: {
    white: "#ffffff",
    black: "#000000",
  },
} as const;

export const semanticTokens = {
  heading: rawColors.black[800],
  body: rawColors.black[500],
  caption: rawColors.black[400],
  surfaceDefault: rawColors.foundation.white,
  surfaceSecondary: rawColors.grey[400],
  surfaceCard: rawColors.grey[600],
  outlineDefault: rawColors.black[100],
  outlineSecondary: rawColors.black[200],
  informationDefault: rawColors.blue[600],
  successDefault: rawColors.green[500],
  warningDefault: rawColors.yellow[800],
  errorDefault: rawColors.red[600],
} as const;
