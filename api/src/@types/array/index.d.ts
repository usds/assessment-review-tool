declare global {
  interface Array<T> {
    flat(): Array<T>;
    flatMap(func: (x: T) => T): Array<T>;
  }
}
