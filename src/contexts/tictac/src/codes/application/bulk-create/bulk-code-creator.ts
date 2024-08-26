import { inject, injectable } from 'inversify';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { CodesRepository } from '../../domain/codes-repository';
import { Code } from '../../domain/code';
import { TicketCode } from '../../domain/ticket-code';
import { CodeTicketType } from '../../domain/code-ticket-type';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';
import { CodeBulkCreationEvent } from '@tictac/tictac/src/kernel/domain/events/code-bulk-creation-event';

export interface BulkCode {
  code: string;
  ticketTypeId: string;
  ticketTypeName: string;
  eventId: string;
}
export type BulkCodeCreatorParameters = BulkCode[];

@injectable()
export class BulkCodeCreator {
  constructor(
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(CodesRepository) private readonly codesRepository: CodesRepository
  ) {}

  async execute(parameters: BulkCodeCreatorParameters) {
    if (parameters.length === 0) {
      return;
    }

    const ticketTypeIds: Set<string> = new Set();
    const codes = parameters.map((code) => {
      ticketTypeIds.add(code.ticketTypeId);

      return Code.create(
        new TicketCode(code.code),
        CodeTicketType.fromPrimitives({ id: code.ticketTypeId, name: code.ticketTypeName }),
        new EventId(code.eventId)
      );
    });

    await this.codesRepository.bulkCreate(codes);

    await this.eventBus.publish([
      new CodeBulkCreationEvent(
        {
          ammount: codes.length,
          ticketTypeIds: Array.from(ticketTypeIds),
        },
        crypto.randomUUID().toString()
      ),
    ]);
  }
}
