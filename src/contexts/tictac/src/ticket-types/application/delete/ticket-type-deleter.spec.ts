import 'reflect-metadata';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { TicketTypeDeleter } from './ticket-type-deleter';
import { TicketTypesRepositoryInMemory } from '../../infrastructure/persistence/in-memory/ticket-types-repository-in-memory';
import { TicketType } from '../../domain/ticket-type';
import { TicketTypesMother } from '../../infrastructure/testing/ticket-types-mother';

describe('TicketTypeDeleter', () => {
  let eventBus: EventBus;
  let ticketTypesRepository: TicketTypesRepository;
  let ticketTypeDeleter: TicketTypeDeleter;
  let ticketTypes: TicketType[];

  beforeEach(() => {
    eventBus = {
      publish: jest.fn(),
      addSubscribers: jest.fn(),
    };
    ticketTypes = Array.from({ length: 3 }, () => TicketTypesMother.random());
    ticketTypesRepository = new TicketTypesRepositoryInMemory(ticketTypes);
    ticketTypeDeleter = new TicketTypeDeleter(eventBus, ticketTypesRepository);
  });

  it('should delete a ticket type', async () => {
    const ticketType = ticketTypes[0];

    await ticketTypeDeleter.execute(ticketType.ticketTypeId.value);

    const expectedEvent = ticketType.toPrimitives();

    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ attributes: expectedEvent })])
    );
  });

  it('should throw an error if the ticket type does not exist', async () => {
    await expect(ticketTypeDeleter.execute('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
      'Ticket type not found'
    );

    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
