import { ValidFonts } from '@/schema/options';

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
 * getFontSetup will return the corresponding metadata for a given font
 * @param font - The font name
 * @returns Font metadata required for the renderer
 */
export function getFontSetup(font: ValidFonts): FontSetupOutput {
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
        fontWidth: 8.35,
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
        fontWidth: 8.15,
      };
    }
    default: {
      throw new TypeError('invalid font was given');
    }
  }
}
