import 'reflect-metadata';

import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { TicketType } from '../../domain/ticket-type';
import { TicketTypesByEventFinder } from './ticket-types-by-event-finder';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';
import { TicketTypesRepositoryInMemory } from '../../infrastructure/persistence/in-memory/ticket-types-repository-in-memory';
import { TicketTypesMother } from '../../infrastructure/testing/ticket-types-mother';

describe('TicketTypesByEventFinder', () => {
  let ticketTypesByEventFinder: TicketTypesByEventFinder;
  let ticketTypesRepository: TicketTypesRepository;
  let eventId: EventId;
  let ticketTypes: TicketType[];

  beforeEach(() => {
    eventId = EventId.random();
    ticketTypes = Array.from({ length: 3 }, () => TicketTypesMother.randomForEvent(eventId));
    ticketTypesRepository = new TicketTypesRepositoryInMemory(ticketTypes);
    ticketTypesByEventFinder = new TicketTypesByEventFinder(ticketTypesRepository);
  });

  it('should return the ticket types for the given event', async () => {
    const foundTicketTypes = await ticketTypesByEventFinder.execute(eventId.value);

    expect(foundTicketTypes).toEqual(ticketTypes.map((ticketType) => ticketType.toPrimitives()));
  });

  it('should return an empty array if there are no ticket types for the given event', async () => {
    const foundTicketTypes = await ticketTypesByEventFinder.execute(EventId.random().value);

    expect(foundTicketTypes).toEqual([]);
  });
});
