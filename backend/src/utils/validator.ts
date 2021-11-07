export const validateBoolean = (name: string, bool: boolean): string => {
  if (bool !== undefined && bool !== null && typeof bool !== 'boolean') return `\`${name}\` must be a boolean!`;
  return '';
};

export const validateString = (name: string, str: string, required: boolean): string => {
  if (!str && required) return `\`${name}\` is required!`;
  if (str && typeof str !== 'string') return `${name} must be a string!`;
  return '';
};

export const validateNumber = (name: string, num: number, min: number, max: number, required: boolean): string => {
  if (!num && required) return `\`${name}\` is required!`;

  if (num === 0 || num) {
    if (typeof num !== 'number') return `\`${name}\` must be a number!`;
    if (!(num >= min && num <= max)) return `\`${name}\` can't be lower than ${1} or higher than ${max}!`;
  }

  return '';
};

export const validateKeys = <T>(name: string, key: T, keys: T[], err: string, required: boolean): string => {
  if (!key && required) return `${name} is required!`;

  const lf = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
  if (key && !keys.includes(key))
    return err ? err : `Bad \`${name}\`! Valid options are ${lf.format(keys.map((x) => `\`${x}\``))}`;

  return '';
};
