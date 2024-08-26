import 'reflect-metadata';
import { faker } from '@faker-js/faker';

// FIXME(pgm) Jest cant load nanoid correctly...
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => faker.string.alphanumeric(21)),
}));

import { CodesRepository } from '../../domain/codes-repository';
import { CodesByTicketTypesIdsFinder } from './codes-by-ticket-types-ids-finder';
import { Code } from '../../domain/code';
import { CodesRepositoryInMemory } from '../../infrastructure/persistence/in-memory/codes-repository-in-memory';
import { CodesMother } from '../../infrastructure/testing/codes-mother';
import { TicketTypesMother } from '@tictac/tictac/src/ticket-types/infrastructure/testing/ticket-types-mother';
import { TicketType } from '@tictac/tictac/src/ticket-types/domain/ticket-type';
import { CodeTicketType } from '../../domain/code-ticket-type';

describe('CodesByTicketTypesIdsFinder', () => {
  let codesRepository: CodesRepository;
  let codesByTicketTypesIdsFinder: CodesByTicketTypesIdsFinder;
  let ticketTypes: TicketType[];
  let codes: Code[];

  beforeEach(() => {
    ticketTypes = Array.from({ length: 3 }, () => TicketTypesMother.random());
    codes = ticketTypes.flatMap((ticketType) =>
      Array.from({ length: 3 }, () =>
        CodesMother.withTicketType(new CodeTicketType(ticketType.ticketTypeId, ticketType.name))
      )
    );

    codesRepository = new CodesRepositoryInMemory(codes);
    codesByTicketTypesIdsFinder = new CodesByTicketTypesIdsFinder(codesRepository);
  });

  it('should return codes by ticket types ids', async () => {
    const { codes: foundCodes } = await codesByTicketTypesIdsFinder.execute({
      ticketTypesIds: ticketTypes.map((ticketType) => ticketType.ticketTypeId.value),
    });

    expect(foundCodes).toHaveLength(codes.length);
    expect(foundCodes).toEqual(codes.map((code) => code.toPrimitives()));
  });

  it('should return codes by ticket types ids with limit and offset', async () => {
    const { codes: foundCodes } = await codesByTicketTypesIdsFinder.execute({
      ticketTypesIds: ticketTypes.map((ticketType) => ticketType.ticketTypeId.value),
      limit: 2,
      offset: 1,
    });

    expect(foundCodes).toHaveLength(2);
    expect(foundCodes).toEqual(codes.slice(1, 3).map((code) => code.toPrimitives()));
  });
});
