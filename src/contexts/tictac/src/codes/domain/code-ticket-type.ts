import { TicketTypeId } from '../../kernel/domain/ticket-type-id';

export class CodeTicketType {
  constructor(
    public readonly id: TicketTypeId,
    public readonly name: string
  ) {}

  static fromPrimitives(primitives: { id: string; name: string }): CodeTicketType {
    return new CodeTicketType(new TicketTypeId(primitives.id), primitives.name);
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name,
    };
  }
}
