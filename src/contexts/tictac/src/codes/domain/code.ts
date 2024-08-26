import { AggregateRoot } from '@tictac/kernel/src/domain/aggregate-root';
import { Option, fromNullable, match, none, some, toNullable } from 'fp-ts/lib/Option';
import { TicketCode } from './ticket-code';
import { EventId } from '../../kernel/domain/event-id';
import { CodeScannedBy } from './code-scanned-by';
import { pipe } from 'fp-ts/lib/function';
import { CodeTicketType } from './code-ticket-type';

export interface CodePrimitives {
  code: string;
  ticketType: {
    id: string;
    name: string;
  };
  eventId: string;
  scannedAt?: Date | null;
  scannedBy?: {
    id: string;
    name: string;
  } | null;
}

export class Code extends AggregateRoot {
  static fromPrimitives(primitives: CodePrimitives): Code {
    return new Code(
      new TicketCode(primitives.code),
      CodeTicketType.fromPrimitives(primitives.ticketType),
      new EventId(primitives.eventId),
      fromNullable(primitives.scannedAt),
      primitives.scannedBy ? some(CodeScannedBy.fromPrimitives(primitives.scannedBy)) : none
    );
  }

  constructor(
    public readonly code: TicketCode,
    public readonly ticketType: CodeTicketType,
    public readonly eventId: EventId,
    public readonly scannedAt: Option<Date>,
    public readonly scannedBy: Option<CodeScannedBy>
  ) {
    super();
  }

  toPrimitives(): CodePrimitives {
    return {
      code: this.code.value,
      ticketType: this.ticketType.toPrimitives(),
      eventId: this.eventId.value,
      scannedAt: toNullable(this.scannedAt),
      scannedBy: pipe(
        this.scannedBy,
        match(
          () => null,
          (scannedBy) => scannedBy.toPrimitives()
        )
      ),
    };
  }
}
