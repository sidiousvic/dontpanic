import { Fail, Outcome, Succeed, Try } from '../src';
describe('Outcome.future', () => {
  describe('should morph a non-async value into a future', () => {
    it('should morph Success<"🌯"> into a Future<"🌯">', async () =>
      expect(await Succeed('🌯').future).toMatchObject({ success: '🌯' }));

    it('should morph Failure<"🌮"> into a Future<Error("🌮")>', async () =>
      expect(await Fail('🌮').future).toMatchObject({ failure: '🌮' }));
  });

  describe('should morph an async value into a future', () => {
    it('should morph Promise.resolve(1) into Succeeded<1>', async () =>
      expect(await Try(Promise.resolve(1)).future).toMatchObject({
        success: 1,
      }));

    it('should morph Promise.resolve(0) into Failed<Error<"0">>', async () =>
      expect(await Try(Promise.reject(new Error('0'))).future).toMatchObject({
        failure: new Error('0'),
      }));
  });

  it('should type rejected promise values as errors', () => {
    const void_: Promise<Outcome<number, Error | 'Error'>> = Try(0)
      .onFailure(() => 'Error' as const)
      .onSuccess(() => Promise.resolve(1)).future;
  });
});
