import { inject, injectable } from 'inversify';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { TicTacEventsRepository } from '../../domain/tictac-events-repository';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';

@injectable()
export class TicTacEventScanningStopper {
  constructor(
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(TicTacEventsRepository) private readonly tictacEventsRepository: TicTacEventsRepository
  ) {}

  async execute(eventId: string): Promise<void> {
    const tictacEvent = await this.tictacEventsRepository.find(new EventId(eventId));
    if (!tictacEvent) {
      // TODO: Create a custom error class
      throw new Error('Event ' + eventId + ' not found');
    }

    if (!tictacEvent.scanning) {
      // TODO: Create a custom error class
      throw new Error('Event ' + eventId + ' is not scanning yet');
    }

    const nonScanningEvent = tictacEvent.stopScanning();
    await this.tictacEventsRepository.save(nonScanningEvent);

    await this.eventBus.publish(nonScanningEvent.pullDomainEvents());
  }
}
