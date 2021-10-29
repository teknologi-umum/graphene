import type { ValidFont } from '../types/function';

type FontFamilies =
  | 'JetBrainsMonoNL Nerd Font Mono'
  | 'FiraCode Nerd Font Mono'
  | 'SFMono Nerd Font'
  | 'Hack Nerd Font Mono'
  | 'Iosevka Nerd Font Mono'
  | 'CaskaydiaCove Nerd Font Mono';

interface FontSetupOutput {
  fontFamily: FontFamilies;
  lineHeightToFontSizeRatio: number;
  fontSize: number;
  fontWidth: number;
}

/**
 * Return font setup options
 * @param {'jetbrains mono' | 'sf mono' | 'fira code'} font
 * @returns {FontSetupOutput}
 */
export const getFontSetup = (font: ValidFont): FontSetupOutput => {
  switch (font.toLowerCase()) {
    case 'jetbrains mono': {
      return {
        fontFamily: 'JetBrainsMonoNL Nerd Font Mono',
        lineHeightToFontSizeRatio: 1.5,
        fontSize: 14,
        fontWidth: 8.4,
      };
    }
    case 'sf mono': {
      return {
        fontFamily: 'SFMono Nerd Font',
        lineHeightToFontSizeRatio: 1.5,
        fontSize: 14,
        fontWidth: 8.65,
      };
    }
    case 'fira code': {
      return {
        fontFamily: 'FiraCode Nerd Font Mono',
        lineHeightToFontSizeRatio: 1.5,
        fontSize: 14,
        fontWidth: 8.65,
      };
    }
    case 'hack': {
      return {
        fontFamily: 'Hack Nerd Font Mono',
        lineHeightToFontSizeRatio: 1.5,
        fontSize: 14,
        fontWidth: 8.65,
      };
    }
    case 'iosevka': {
      return {
        fontFamily: 'Iosevka Nerd Font Mono',
        lineHeightToFontSizeRatio: 1.5,
        fontSize: 14,
        fontWidth: 7,
      };
    }
    case 'cascadia code': {
      return {
        fontFamily: 'CaskaydiaCove Nerd Font Mono',
        lineHeightToFontSizeRatio: 1.5,
        fontSize: 14,
        fontWidth: 8.65,
      };
    }
    default: {
      throw new TypeError('invalid font was given');
    }
  }
};
