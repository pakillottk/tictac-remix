import { TicTacEventPrimitives } from '../../domain/tictac-event';
import { TicTacEventsRepository } from '../../domain/tictac-events-repository';

export type FoundTicTacEvent = TicTacEventPrimitives;
export type TicTacEventsAllSearcherResponse = FoundTicTacEvent[];

export class TicTacEventsAllSearcher {
  constructor(private readonly repository: TicTacEventsRepository) {}

  async execute(): Promise<TicTacEventsAllSearcherResponse> {
    const events = await this.repository.findAll();
    return events.map((event) => event.toPrimitives());
  }
}
