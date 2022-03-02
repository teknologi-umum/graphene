/**
 * validateBoolean will validate if a given value is boolean.
 * @param name - The name of the variable
 * @param bool - The value of the variable
 * @returns An error message
 */
export function validateBoolean(name: string, bool: boolean): string {
  if (bool !== undefined && bool !== null && typeof bool !== 'boolean') {
    return `\`${name}\` must be a boolean!`;
  }
  return '';
}

/**
 * validateString will validate if a given value is a valid string.
 * @param name - The name of the variable
 * @param str - The value of the variable
 * @param required - Whether or not the value is required
 * @returns An error message
 */
export function validateString(name: string, str: string, required: boolean): string {
  if (!str && required) {
    return `\`${name}\` is required!`;
  }

  if (str && typeof str !== 'string') {
    return `${name} must be a string!`;
  }

  return '';
}

/**
 * validateNumber will validate if the given number is present and within the specified range
 * @param name - The name of the variable
 * @param num - The value of the variable
 * @param min - The minimum value of the variable
 * @param max - The maximum value of the variable
 * @param required - Whether or not the value is required
 * @returns An error message
 */
export function validateNumber(name: string, num: number, min: number, max: number, required: boolean): string {
  if (!num && required) {
    return `\`${name}\` is required!`;
  }

  if (num === 0 || num) {
    if (typeof num !== 'number') return `\`${name}\` must be a number!`;
    if (!(num >= min && num <= max)) return `\`${name}\` can't be lower than ${1} or higher than ${max}!`;
  }

  return '';
}

/**
 * validateKeys will check if a key is present from a list of keys.
 * @param name - The name of the variable
 * @param key - The value of the variable
 * @param keys - The valid keys
 * @param err - Custom error message
 * @param required - Whether or not the value is required
 * @returns An error message
 */
export function validateKeys<T>(name: string, key: T, keys: T[], err: string, required: boolean): string {
  if (!key && required) {
    return `${name} is required!`;
  }

  const lf = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
  if (key && !keys.includes(key)) {
    return err !== '' ? err : `Bad \`${name}\`! Valid options are ${lf.format(keys.map((x) => `\`${x}\``))}`;
  }

  return '';
}
