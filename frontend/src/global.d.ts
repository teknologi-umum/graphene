// This is just some quick type defs, no need to be accurate since we're only
// using it in one place and nobody cares
declare namespace Intl {
  class ListFormat {
    constructor(locale: string, opts: Record<string, unknown>);
    public format(items: string[]): string;
  }
}
