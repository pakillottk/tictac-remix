import { AggregateRoot } from '@tictac/kernel/src/domain/aggregate-root';
import { Option } from '@tictac/kernel/src/domain/option';
import { TicketCode } from './ticket-code';
import { EventId } from '../../kernel/domain/event-id';
import { CodeScannedBy } from './code-scanned-by';
import { CodeTicketType } from './code-ticket-type';
import { CodeCreatedEvent } from '@tictac/tictac/src/kernel/domain/events/code-created-event';
import { CodeDeletedEvent } from '../../kernel/domain/events/code-deleted-event';
import { CodeScannedEvent } from '../../kernel/domain/events/code-scanned-event';

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
      Option.fromNullable(primitives.scannedAt),
      primitives.scannedBy ? Option.some(CodeScannedBy.fromPrimitives(primitives.scannedBy)) : Option.none()
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

  get isScanned(): boolean {
    return this.scannedAt.isSome();
  }

  static create(code: TicketCode, ticketType: CodeTicketType, eventId: EventId): Code {
    const newCode = new Code(code, ticketType, eventId, Option.none(), Option.none());
    newCode.record(
      new CodeCreatedEvent({ code: code.value, ticketTypeId: ticketType.id.value, eventId: eventId.value }, code.value)
    );
    return newCode;
  }

  public delete(): void {
    this.record(
      new CodeDeletedEvent(
        { code: this.code.value, ticketTypeId: this.ticketType.id.value, eventId: this.eventId.value },
        this.code.value
      )
    );
  }

  public updateTicketType(ticketType: CodeTicketType): Code {
    // TODO(pgm): Domain events...
    return new Code(this.code, ticketType, this.eventId, this.scannedAt, this.scannedBy);
  }

  public scan(scannedBy: CodeScannedBy): Code {
    if (this.isScanned) {
      // TODO: Custom exception
      throw new Error('Code already scanned');
    }

    const updatedCode = new Code(
      this.code,
      this.ticketType,
      this.eventId,
      Option.some(new Date()),
      Option.some(scannedBy)
    );
    updatedCode.record(
      new CodeScannedEvent(
        {
          code: this.code.value,
          ticketTypeId: this.ticketType.id.value,
          eventId: this.eventId.value,
          scannedBy: scannedBy.toPrimitives(),
        },
        this.code.value
      )
    );

    return updatedCode;
  }

  toPrimitives(): CodePrimitives {
    return {
      code: this.code.value,
      ticketType: this.ticketType.toPrimitives(),
      eventId: this.eventId.value,
      scannedAt: this.scannedAt.toNullable(),
      scannedBy: this.scannedBy.match(
        (scannedBy) => scannedBy.toPrimitives(),
        () => null
      ),
    };
  }
}
