import { DEFAULT_BORDER_COLOR, FONTS, IMAGE_FORMATS } from 'shared';

const listFormatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
export const options = [
  {
    title: 'code',
    desc: 'The code snippet you want to prettify. Use <code>\\n</code> for newline',
    required: true,
    validValues: 'String',
  },
  {
    title: 'language',
    desc: 'The language used for highlighting. See shikijs/language. If you leave this field empty, flourite will try its best to guess it.',
    required: false,
    defaultValue: 'auto-detect',
    validValues: '<a href="https://github.com/shikijs/shiki/blob/main/docs/languages.md">See here</a>',
  },
  {
    title: 'imageFormat',
    desc: "The output image format. If you choose svg, you won't get border since the border is created by sharpjs instead of embedding it in the svg.",
    required: false,
    defaultValue: 'png',
    validValues: listFormatter.format(IMAGE_FORMATS.map((format) => `<code>${format}</code>`)),
  },
  {
    title: 'upscale',
    desc: 'How much do you want to upscale the image. The higher, the better.',
    required: false,
    defaultValue: '1x',
    validValues: '1 - 5',
  },
  {
    title: 'theme',
    desc: 'Colorscheme used to highlight the code.',
    required: false,
    defaultValue: 'github-dark',
    validValues: '<a href="https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes">See here</a>',
  },
  {
    title: 'font',
    desc: 'Colorscheme used to highlight the code.',
    required: false,
    defaultValue: 'JetBrains Mono',
    validValues: listFormatter.format(FONTS.map((font) => `<code>${font}</code>`)),
  },
  {
    title: 'showLineNumber',
    desc: 'Toggle line number. Might be useful for longer code',
    required: false,
    defaultValue: 'false',
    validValues: '<code>true</code> or <code>false</code>',
  },
  {
    title: 'border.radius',
    desc: 'The size of the border-radius.',
    required: false,
    defaultValue: '0 when no borders are given, 6 otherwise',
    validValues: '0 - Infinity',
  },
  {
    title: 'border.thickness',
    desc: 'The thickness of the border. Zero means no border.',
    required: false,
    defaultValue: '0',
    validValues: '1 - Infinity',
  },
  {
    title: 'border.colour',
    desc: 'The colour of the border in HEX format. Ex: #efefef, #1E2329',
    required: false,
    defaultValue: DEFAULT_BORDER_COLOR,
    validValues: 'Any valid HEX colour',
  },
];
