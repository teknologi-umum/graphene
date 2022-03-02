/**
 * resolveObject is a functiont that will resolve an object using dot syntax from a given string
 * @param {obj} object - Any object
 * @param {key} key - Dot notation string
 * @example
 *    given: resolve({ foo: { bar: { baz: "something" } } }, "foo.bar.baz")
 *    expected: "something"
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resolveObject = (obj: any, key: string): any => {
  for (const k of key.split('.')) {
    obj = obj?.[k];
  }

  return obj;
};
