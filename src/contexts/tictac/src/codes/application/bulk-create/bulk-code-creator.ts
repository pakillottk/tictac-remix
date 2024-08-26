import { inject, injectable } from 'inversify';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { CodesRepository } from '../../domain/codes-repository';
import { Code } from '../../domain/code';
import { TicketCode } from '../../domain/ticket-code';
import { CodeTicketType } from '../../domain/code-ticket-type';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';

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
    const codes = parameters.map((code) =>
      Code.create(
        new TicketCode(code.code),
        CodeTicketType.fromPrimitives({ id: code.ticketTypeId, name: code.ticketTypeName }),
        new EventId(code.eventId)
      )
    );

    await this.codesRepository.bulkCreate(codes);

    this.eventBus.publish(codes.flatMap((code) => code.pullDomainEvents()));
  }
}
