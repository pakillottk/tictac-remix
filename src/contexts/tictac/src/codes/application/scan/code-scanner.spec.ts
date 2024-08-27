import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { CodesRepository } from '../../domain/codes-repository';
import { CodeScanner } from './code-scanner';
import { Code } from '../../domain/code';
import { CodesRepositoryInMemory } from '../../infrastructure/persistence/in-memory/codes-repository-in-memory';
import { CodesMother } from '../../infrastructure/testing/codes-mother';
import { QueryBus } from '@tictac/kernel/src/domain/query-bus';

// FIXME(pgm) Jest cant load nanoid correctly...
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => faker.string.alphanumeric(21)),
}));

describe('CodeScanner', () => {
  let queryBus: QueryBus;
  let eventBus: EventBus;
  let codes: Code[];
  let codesRepository: CodesRepository;
  let codeScanner: CodeScanner;

  beforeEach(() => {
    queryBus = {
      ask: jest.fn().mockResolvedValue({
        eventId: faker.string.uuid(),
        scanning: true,
      }),
    };
    eventBus = { publish: jest.fn(), addSubscribers: jest.fn() };
    codes = Array.from({ length: 2 }, (_, i) => CodesMother.random(i === 1));
    codesRepository = new CodesRepositoryInMemory(codes);
    codeScanner = new CodeScanner(queryBus, eventBus, codesRepository);
  });

  it('should scan the code', async () => {
    const code = codes[0];
    const scannedBy = {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
    };

    await codeScanner.execute({ eventId: code.eventId.value, ticketCode: code.code.value, scannedBy });

    const scannedCode = await codesRepository.findByCode(code.code);
    expect(scannedCode?.isScanned).toBe(true);

    const scannedCodeScannedBy = scannedCode!.scannedBy.toNullable();
    expect(scannedCodeScannedBy?.id).toBe(scannedBy.id);
    expect(scannedCodeScannedBy?.name).toBe(scannedBy.name);

    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledWith([
      expect.objectContaining({
        attributes: {
          code: code.code.value,
          ticketTypeId: code.ticketType.id.value,
          eventId: code.eventId.value,
          scannedBy,
        },
      }),
    ]);
  });

  it('should throw an error when the code is not found', async () => {
    const ticketCode = faker.string.alphanumeric(10);
    const scannedBy = {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
    };

    await expect(
      codeScanner.execute({ eventId: crypto.randomUUID().toString(), ticketCode, scannedBy })
    ).rejects.toThrow('Code ' + ticketCode + ' not found');
  });

  it('should throw an error when the code is already scanned', async () => {
    const code = codes[1];
    const scannedBy = {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
    };

    await expect(
      codeScanner.execute({ eventId: code.eventId.value, ticketCode: code.code.value, scannedBy })
    ).rejects.toThrow('Code already scanned');
  });
});
