export abstract class BaseFactory<T> {
  abstract definition(): Partial<T>;

  public make(override: Partial<T> = {}): Partial<T> {
    return {
      ...this.definition(),
      ...override,
    };
  }
}
