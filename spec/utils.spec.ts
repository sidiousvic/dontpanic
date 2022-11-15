import { toError } from '../src/utils';

describe('toError', () => {
  it('should act as identity for an Error', () =>
    expect(toError(new Error('🅧'))).toStrictEqual(new Error('🅧')));

  it('should morph a non-Error value into an Error containing the value as a serialized string', () =>
    expect(toError(0)).toStrictEqual(new Error('0')));
});
