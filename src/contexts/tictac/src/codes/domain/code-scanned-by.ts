export class CodeScannedBy {
  // TODO(pgm) Custom value object for id and name
  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}

  toPrimitives(): { id: string; name: string } {
    return {
      id: this.id,
      name: this.name,
    };
  }

  static fromPrimitives(primitives: { id: string; name: string }): CodeScannedBy {
    return new CodeScannedBy(primitives.id, primitives.name);
  }
}
