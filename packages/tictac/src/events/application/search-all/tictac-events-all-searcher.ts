import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { TicTacEventPrimitives } from '../../domain/tictac-event';
import { TicTacEventsRepository } from '../../domain/tictac-events-repository';

export type FoundTicTacEvent = TicTacEventPrimitives;
export type TicTacEventsAllSearcherResponse = FoundTicTacEvent[];

@injectable()
export class TicTacEventsAllSearcher {
  constructor(@inject(TicTacEventsRepository) private readonly repository: TicTacEventsRepository) {}

  async execute(): Promise<TicTacEventsAllSearcherResponse> {
    const events = await this.repository.findAll();
    return events.map((event) => event.toPrimitives());
  }
}
