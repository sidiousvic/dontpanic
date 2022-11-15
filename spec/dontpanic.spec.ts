import { DontPanic } from '../src';

describe('Integrated usage', () => {
  it('should morph a throwable into a non-throwable that returns a outcome', () =>
    expect(
      DontPanic(() => {
        throw new Error();
      })()
    ).toMatchObject({ failure: new Error() }));
  it('should morph a thrown non-Error into an Error', () =>
    expect(
      DontPanic(() => {
        throw 0;
      })()
    ).toMatchObject({ failure: new Error('0') }));
});
