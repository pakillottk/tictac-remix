import 'reflect-metadata';
import { faker } from '@faker-js/faker';

// FIXME(pgm) Jest cant load nanoid correctly...
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => faker.string.alphanumeric(21)),
}));

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { CodesRepository } from '../../domain/codes-repository';
import { CodeDeleter } from './code-deleter';
import { CodesRepositoryInMemory } from '../../infrastructure/persistence/in-memory/codes-repository-in-memory';
import { Code } from '../../domain/code';
import { CodesMother } from '../../infrastructure/testing/codes-mother';

describe('CodeDeleter', () => {
  let eventBus: EventBus;
  let codes: Code[];
  let codesRepository: CodesRepository;
  let codeDeleter: CodeDeleter;

  beforeEach(() => {
    eventBus = {
      publish: jest.fn(),
      addSubscribers: jest.fn(),
    };
    codes = Array.from({ length: 10 }, (_, i) => CodesMother.random(i === 1));
    codesRepository = new CodesRepositoryInMemory(codes);
    codeDeleter = new CodeDeleter(eventBus, codesRepository);
  });

  it('should delete a code', async () => {
    const code = codes[0];

    await codeDeleter.execute(code.code.value);

    const codeFound = await codesRepository.findByCode(code.code);
    expect(codeFound).toBeNull();

    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledWith([
      expect.objectContaining({
        attributes: {
          code: code.code.value,
          eventId: code.eventId.value,
          ticketTypeId: code.ticketType.id.value,
        },
      }),
    ]);
  });

  it('should throw an error when code not found', async () => {
    const code = 'invalid-code';

    await expect(codeDeleter.execute(code)).rejects.toThrow('Code invalid-code not found');
  });

  it('should throw an error when code is already scanned', async () => {
    const code = codes[1];

    await expect(codeDeleter.execute(code.code.value)).rejects.toThrow(
      'Code ' + code.code.value + ' is already scanned'
    );
  });
});
