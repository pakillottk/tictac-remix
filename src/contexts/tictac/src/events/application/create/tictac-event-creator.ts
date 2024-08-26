import { inject, injectable } from 'inversify';
import { TicTacEventsRepository } from '../../domain/tictac-events-repository';
import { TicTacEvent, TicTacEventPrimitives } from '../../domain/tictac-event';
import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { fromNullable } from 'fp-ts/lib/Option';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';

export type TicTacEventCreatorParams = TicTacEventPrimitives;

@injectable()
export class TicTacEventCreator {
  constructor(
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(TicTacEventsRepository) private readonly tictacEventsRepository: TicTacEventsRepository
  ) {}

  async execute(params: TicTacEventCreatorParams): Promise<void> {
    const tictacEvent = TicTacEvent.create(
      new EventId(params.eventId),
      params.name,
      params.description,
      params.eventLocation,
      params.eventDate,
      params.scanning,
      params.ownerId,
      params.ownerName,
      fromNullable(params.eventImage)
    );
    await this.tictacEventsRepository.save(tictacEvent);

    await this.eventBus.publish(tictacEvent.pullDomainEvents());
  }
}
