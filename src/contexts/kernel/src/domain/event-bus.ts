import { DomainEvent } from './domain-event';
import { DomainEventSubscriber } from './domain-event-subscriber';

export abstract class EventBus {
  abstract publish(events: Array<DomainEvent>): Promise<void>;
  abstract addSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void;
}
