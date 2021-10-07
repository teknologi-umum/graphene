import type { ValidFont } from '../types/function';

interface FontSetupOutput {
  fontFamily: 'JetBrainsMono Nerd Font' | 'FiraCode Nerd Font' | 'SFMono Nerd Font';
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
        fontFamily: 'JetBrainsMono Nerd Font',
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
        fontFamily: 'FiraCode Nerd Font',
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
