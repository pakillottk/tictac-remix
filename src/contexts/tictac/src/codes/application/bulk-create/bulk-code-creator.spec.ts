import 'reflect-metadata';
import { faker } from '@faker-js/faker';

// FIXME(pgm) Jest cant load nanoid correctly...
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => faker.string.alphanumeric(21)),
}));

import { CodesRepository } from '../../domain/codes-repository';
import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { BulkCodeCreator } from './bulk-code-creator';
import { CodesRepositoryInMemory } from '../../infrastructure/persistence/in-memory/codes-repository-in-memory';
import { TicketCode } from '../../domain/ticket-code';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';

describe('BulkCodeCreator', () => {
  let eventBus: EventBus;
  let codesRepository: CodesRepository;
  let bulkCodeCreator: BulkCodeCreator;

  beforeEach(() => {
    eventBus = { publish: jest.fn(), addSubscribers: jest.fn() };
    codesRepository = new CodesRepositoryInMemory();
    bulkCodeCreator = new BulkCodeCreator(eventBus, codesRepository);
  });

  it('should create all the codes', async () => {
    const codes = Array.from({ length: 10 }, () => {
      return {
        code: TicketCode.random().value,
        ticketTypeId: TicketTypeId.random().value,
        ticketTypeName: faker.commerce.product(),
        eventId: EventId.random().value,
      };
    });

    await bulkCodeCreator.execute(codes);

    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledWith(
      codes.map((code) =>
        expect.objectContaining({
          attributes: {
            code: code.code,
            ticketTypeId: code.ticketTypeId,
            eventId: code.eventId,
          },
        })
      )
    );

    const allCodes = await codesRepository.findAll();
    expect(allCodes).toHaveLength(codes.length);
    expect(
      allCodes.map((code) => ({
        code: code.code.value,
        ticketTypeId: code.ticketType.id.value,
        ticketTypeName: code.ticketType.name,
        eventId: code.eventId.value,
      }))
    ).toEqual(codes);
  });
});
