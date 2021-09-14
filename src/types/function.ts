import { Lang, Theme } from 'shiki';

export type ScreenshotFunc = (code: string, lang: Lang, username: string, theme: Theme) => Promise<any>;
