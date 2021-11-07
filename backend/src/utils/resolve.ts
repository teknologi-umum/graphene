/**
 * Resolve object path using dot syntax in a string
 * @param {obj} object - Any object
 * @param {key} key - Dot notation string
 * @example
 *    given: resolve({ foo: { bar: { baz: "something" } } }, "foo.bar.baz")
 *    expected: "something"
 */
// eslint-disable-next-line
export const resolve = (obj: any, key: string): any => {
  for (const k of key.split('.')) {
    obj = obj?.[k];
  }

  return obj;
};
