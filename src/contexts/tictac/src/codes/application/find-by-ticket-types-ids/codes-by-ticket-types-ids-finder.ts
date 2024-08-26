import { inject, injectable } from 'inversify';

import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { CodePrimitives } from '../../domain/code';
import { CodesRepository } from '../../domain/codes-repository';

export type FoundCode = CodePrimitives;

export interface CodesByTicketTypesIdsFinderParameters {
  ticketTypesIds: string[];
  limit?: number;
  offset?: number;
}

export interface CodesByTicketTypesIdsFinderResult {
  codes: FoundCode[];
  total: number;
  offset: number;
  count: number;
}

@injectable()
export class CodesByTicketTypesIdsFinder {
  constructor(@inject(CodesRepository) private readonly codesRepository: CodesRepository) {}

  async execute(parameters: CodesByTicketTypesIdsFinderParameters): Promise<CodesByTicketTypesIdsFinderResult> {
    const { codes, count } = await this.codesRepository.findByTicketTypesIds(
      parameters.ticketTypesIds.map((id) => new TicketTypeId(id)),
      parameters.limit ?? 100,
      parameters.offset ?? 0
    );

    return {
      codes: codes.map((code) => code.toPrimitives()),
      total: count,
      offset: parameters.offset ?? 0,
      count: codes.length,
    };
  }
}
