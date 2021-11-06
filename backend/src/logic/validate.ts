import { Option, VALID_OPTIONS } from '../constant/options';
import type { ValidOptions } from '../types/function';
import { resolve } from '../utils/resolve';
import { validateBoolean, validateKeys, validateNumber, validateString } from '../utils/validator';

/**
 * Validate valid options
 * @param {ValidateFuncOptions} validate
 */
export const validate = (opts: ValidOptions): string[] => {
  return Object.keys(VALID_OPTIONS)
    .map((k) => {
      const optVal = resolve(opts, k);
      const current: Option = VALID_OPTIONS[k];

      switch (current.type) {
        case 'boolean':
          return validateBoolean(k, optVal);
        case 'string':
          return validateString(k, (optVal || '').toLowerCase(), current.isRequired);
        case 'number':
          return validateNumber(k, optVal, current.min as number, current.max as number, current.isRequired);
        case 'keys':
          return validateKeys(k, optVal, current.options as string[], current.errorMessage || '', current.isRequired);
        default:
          return '';
      }
    })
    .filter(Boolean) as string[];
};
