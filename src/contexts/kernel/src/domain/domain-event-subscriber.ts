import { injectable } from 'inversify';
import { DomainEvent, DomainEventClass } from './domain-event';

@injectable()
export abstract class DomainEventSubscriber<T extends DomainEvent> {
  abstract subscribedTo(): Array<DomainEventClass>;
  abstract on(domainEvent: T): Promise<void>;
}
