import { TicTacEvent } from './tictac-event';

export abstract class TicTacEventsRepository {
  abstract save(event: TicTacEvent): Promise<void>;
  abstract find(eventId: string): Promise<TicTacEvent | null>;
  abstract findAll(): Promise<TicTacEvent[]>;
}
