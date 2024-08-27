export class Option<T> {
  static some<T>(value: T): Option<T> {
    return new Option<T>(value);
  }

  static none<T>(): Option<T> {
    return new Option<T>();
  }

  static fromNullable<T>(value: T | null | undefined): Option<T> {
    return value === null || value === undefined ? Option.none() : Option.some(value);
  }

  private constructor(private readonly value?: T) {}

  public isSome(): boolean {
    return this.value !== undefined;
  }

  public isNone(): boolean {
    return !this.isSome();
  }

  public getOrElse(defaultValue: T): T {
    return this.isSome() ? this.value! : defaultValue;
  }

  public map<U>(f: (value: T) => U): Option<U> {
    return this.isSome() ? Option.some(f(this.value!)) : Option.none();
  }

  public flatMap<U>(f: (value: T) => Option<U>): Option<U> {
    return this.isSome() ? f(this.value!) : Option.none();
  }

  public filter(f: (value: T) => boolean): Option<T> {
    return this.isSome() && f(this.value!) ? this : Option.none();
  }

  public match<U>(onSome: (value: T) => U, onNone: () => U): U {
    return this.isSome() ? onSome(this.value!) : onNone();
  }

  public equals(other: Option<T>): boolean {
    return this.isSome() ? other.isSome() && this.value === other.value : other.isNone();
  }

  public toNullable(): T | null {
    return this.isSome() ? this.value! : null;
  }
}
