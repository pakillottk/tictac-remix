import { injectable } from 'inversify';
import { TicTacEvent } from './tictac-event';
import { EventId } from '../../kernel/domain/event-id';

@injectable()
export abstract class TicTacEventsRepository {
  abstract save(event: TicTacEvent): Promise<void>;
  abstract find(eventId: EventId): Promise<TicTacEvent | null>;
  abstract findAll(): Promise<TicTacEvent[]>;
}
