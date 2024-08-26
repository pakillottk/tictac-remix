import 'reflect-metadata';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { TicketTypeEditor } from './ticket-type-editor';
import { TicketTypesRepositoryInMemory } from '../../infrastructure/persistence/in-memory/ticket-types-repository-in-memory';
import { TicketType } from '../../domain/ticket-type';
import { TicketTypesMother } from '../../infrastructure/testing/ticket-types-mother';

describe('TicketTypeEditor', () => {
  let eventBus: EventBus;
  let ticketTypeRepository: TicketTypesRepository;
  let ticketTypeEditor: TicketTypeEditor;
  let ticketType: TicketType;

  beforeEach(() => {
    eventBus = {
      publish: jest.fn(),
      addSubscribers: jest.fn(),
    };
    ticketType = TicketTypesMother.random();
    ticketTypeRepository = new TicketTypesRepositoryInMemory([ticketType]);
    ticketTypeEditor = new TicketTypeEditor(eventBus, ticketTypeRepository);
  });

  it('should edit a ticket type', async () => {
    const editedTicketType = TicketTypesMother.random();
    const params = {
      ticketTypeId: ticketType.ticketTypeId.value,
      name: editedTicketType.name,
    };

    await ticketTypeEditor.execute(params);

    const found = await ticketTypeRepository.findById(ticketType.ticketTypeId);
    expect(found?.toPrimitives()).toEqual({
      ...ticketType.toPrimitives(),
      name: editedTicketType.name,
    });

    const expectedDomainEvent = {
      ticketTypeId: ticketType.ticketTypeId.value,
      oldValues: {
        name: ticketType.name,
      },
      newValues: {
        name: editedTicketType.name,
      },
      eventId: ticketType.eventId.value,
    };

    expect(eventBus.publish).toHaveBeenCalledWith([expect.objectContaining({ attributes: expectedDomainEvent })]);
  });

  it('should throw an error when the ticket type does not exist', async () => {
    const params = {
      ticketTypeId: '00000000-0000-0000-0000-000000000000',
      name: 'edited-name',
      price: 100,
    };

    await expect(ticketTypeEditor.execute(params)).rejects.toThrow('Ticket type not found');
  });
});
