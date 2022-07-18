import { lowerCasedString } from "~/schema/common";

// export const FONT_MAPPING = {
//   hack: "Hack Nerd Font Mono",
//   iosevka: "Iosevka Nerd Font Mono",
//   "cascadia code": "CaskaydiaCove Nerd Font Mono",
//   "fira code": "FiraCode Nerd Font Mono",
//   "jetbrains mono": "JetBrainsMonoNL Nerd Font Mono",
//   "sf mono": "SFMono Nerd Font"
// } as const;

export const FONT_MAPPING = {
  hack: {
    fontFamily: "Hack Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.35
  },
  iosevka: {
    fontFamily: "Iosevka Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 7
  },
  "jetbrains mono": {
    fontFamily: "JetBrainsMonoNL Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.4
  },
  "sf mono": {
    fontFamily: "SFMono Nerd Font",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.65
  },
  "fira code": {
    fontFamily: "FiraCode Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.65
  },
  "cascadia code": {
    fontFamily: "CaskaydiaCove Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.15
  }
} as const;

export const FONTS = Object.keys(FONT_MAPPING);

export type Font = keyof typeof FONT_MAPPING;
export type FontConfig = typeof FONT_MAPPING[Font];

export const fontSchema = lowerCasedString.refine((font) => FONTS.includes(font as Font)).default("sf mono");
