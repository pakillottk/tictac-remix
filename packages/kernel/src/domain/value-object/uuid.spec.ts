import { InvalidArgumentError } from "./invalid-argument-error";
import { Uuid } from "./uuid";

describe('Uuid', () => {
  it('should create a valid UUID', () => {
    const uuid = Uuid.random();
    expect(uuid).toBeInstanceOf(Uuid);
  });

  it('should throw an error if the UUID is invalid', () => {
    expect(() => new Uuid('invalid-uuid')).toThrow(InvalidArgumentError);
  });
});