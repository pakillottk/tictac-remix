import { EventEmitter } from 'events';
import { DomainEvent } from '../../../domain/domain-event';
import { EventBus } from '../../../domain/event-bus';
import { DomainEventSubscriber } from '../../../domain/domain-event-subscriber';

export class InMemoryAsyncEventBus extends EventEmitter implements EventBus {
  async publish(events: DomainEvent[]): Promise<void> {
    events.map((event) => this.emit(event.eventName, event));
  }

  addSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]) {
    subscribers.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((event) => {
        this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
      });
    });
  }
}
