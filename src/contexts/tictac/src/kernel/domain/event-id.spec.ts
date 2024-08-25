import { InvalidArgumentError } from '@tictac/kernel/src/domain/value-object/invalid-argument-error';
import { EventId } from './event-id';

describe('EventId', () => {
  it('should create a new event id with a valid uuid', () => {
    const eventId = EventId.random();
    expect(eventId).toBeInstanceOf(EventId);

    const uuid = eventId.value;
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('should create a new event id with a given uuid', () => {
    const uuid = '00000000-0000-0000-0000-000000000000';
    const eventId = new EventId(uuid);
    expect(eventId).toBeInstanceOf(EventId);
    expect(eventId.value).toBe(uuid);
  });

  it('should throw an error when creating a new event id with an invalid uuid', () => {
    const uuid = 'invalid-uuid';
    expect(() => new EventId(uuid)).toThrow(InvalidArgumentError);
  });
});
