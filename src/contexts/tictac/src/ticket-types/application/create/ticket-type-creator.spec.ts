import 'reflect-metadata';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { TicketTypeCreator } from './ticket-type-creator';
import { TicketTypesRepositoryInMemory } from '../../infrastructure/persistence/in-memory/ticket-types-repository-in-memory';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { QueryBus } from '@tictac/kernel/src/domain/query-bus';

describe('TicketTypeCreator', () => {
  let ticketTypeCreator: TicketTypeCreator;
  let ticketTypesRepository: TicketTypesRepository;
  let eventBus: EventBus;
  let queryBus: QueryBus;

  beforeEach(() => {
    ticketTypesRepository = new TicketTypesRepositoryInMemory();
    eventBus = {
      publish: jest.fn(),
      addSubscribers: jest.fn(),
    };
    queryBus = {
      ask: jest.fn().mockResolvedValue({
        eventId: 'event-id',
        name: 'event-name',
        eventDate: new Date(),
        scanning: false,
      }),
    };
    ticketTypeCreator = new TicketTypeCreator(eventBus, queryBus, ticketTypesRepository);
  });

  it('should create a ticket type', async () => {
    const ticketTypeId = crypto.randomUUID().toString();
    const name = 'VIP';
    const eventId = crypto.randomUUID().toString();

    await ticketTypeCreator.execute({ ticketTypeId, name, eventId });

    const ticketType = await ticketTypesRepository.findById(new TicketTypeId(ticketTypeId));

    expect(ticketType).not.toBeNull();
    expect(ticketType?.ticketTypeId.value).toBe(ticketTypeId);
    expect(ticketType?.name).toBe(name);
    expect(ticketType?.eventId.value).toBe(eventId);

    expect(eventBus.publish).toHaveBeenCalledWith([
      expect.objectContaining({
        attributes: {
          ticketTypeId,
          name,
          eventId,
        },
      }),
    ]);
  });

  it('should throw an error if the event is scanning', async () => {
    (queryBus.ask as jest.Mock).mockResolvedValue({
      eventId: 'event-id',
      name: 'event-name',
      eventDate: new Date(),
      scanning: true,
    });

    await expect(
      ticketTypeCreator.execute({ ticketTypeId: 'ticket-type-id', name: 'VIP', eventId: 'event-id' })
    ).rejects.toThrow('Scanning event is not editable');
  });
});
