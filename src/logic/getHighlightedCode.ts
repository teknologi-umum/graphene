import type { IThemeRegistration } from 'shiki';
import shiki from 'shiki';
import type { HighlightedCode } from '../types/highlight';

/**
 * Generate a highlighted code
 * @param {string} code - Raw code
 * @param {string} lang - Language
 * @return {Promise<string>} Highlighted code in HTML string
 */
export const getHighlightedCode = async (
  code: string,
  lang: string,
  theme: IThemeRegistration,
): Promise<HighlightedCode> => {
  const highlighter = await shiki.getHighlighter({ theme });
  const result = highlighter.codeToHtml(code, lang);

  return {
    highlightedCode: result,
    windowBackground: highlighter.getBackgroundColor(),
    titleColor: highlighter.getForegroundColor(),
  };
};
