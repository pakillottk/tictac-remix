import { inject, injectable } from 'inversify';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { TicketType } from '../../domain/ticket-type';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';
import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { QueryBus } from '@tictac/kernel/src/domain/query-bus';
import {
  EventBasicInfoQuery,
  EventBasicInfoQueryResponse,
} from '@tictac/tictac/src/kernel/domain/queries/event-basic-info-query';

export interface TicketTypeCreatorParameters {
  ticketTypeId: string;
  name: string;
  eventId: string;
}

@injectable()
export class TicketTypeCreator {
  constructor(
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(QueryBus) private readonly queryBus: QueryBus,
    @inject(TicketTypesRepository) private readonly ticketTypesRepository: TicketTypesRepository
  ) {}

  async execute(parameters: TicketTypeCreatorParameters) {
    const eventInfo = await this.queryBus.ask<EventBasicInfoQueryResponse>(new EventBasicInfoQuery(parameters.eventId));
    if (eventInfo.scanning) {
      // TODO: Create a custom exception
      throw new Error('Scanning event is not editable');
    }

    const ticketType = TicketType.create(
      new TicketTypeId(parameters.ticketTypeId),
      parameters.name,
      new EventId(parameters.eventId)
    );
    await this.ticketTypesRepository.save(ticketType);

    this.eventBus.publish(ticketType.pullDomainEvents());
  }
}
