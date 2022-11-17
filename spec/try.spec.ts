import { Fail, Failed, Ok, Succeed, Try } from '../src';
import { falsyValues, toError, truthyValues } from '../src/utils';

describe('Integrated usage', () => {
  it('should handle invalid dates as failures', () =>
    expect(Try(new Date('💩')).status).toBe(Failed));

  it('should unwrap a list of outcomes into a list of successes', () =>
    expect(Try([Try(1), Try(2), Try(3)])).toMatchObject({
      success: [1, 2, 3],
    }));

  it('should unwrap a list of outcomes into the first failure', () =>
    expect(Try([Try(1), Try(0), Try(3)])).toMatchObject({
      failure: 0,
    }));

  it('should be able to chain operations', () => {
    expect(
      Succeed(25)
        .onSuccess(Math.sqrt)
        .onFailure(toError)
        .onSuccess(Math.log)
        .onFailure(toError).success
    ).toBe(Math.log(Math.sqrt(25)));

    expect(
      Fail(0)
        .onSuccess(JSON.stringify)
        .onFailure(Math.log)
        .onSuccess(JSON.parse)
        .onFailure(toError).failure
    ).toStrictEqual(toError(Math.log(0)));
  });

  it.only('should handle arrays with nullish values', () => {
    //
    Try([undefined]);
  });

  it('should bind (flatMap) operations', () => {
    expect(
      Fail(0)
        .onFailure(Fail)
        .onSuccess(JSON.stringify)
        .onFailure(Succeed)
        .onFailure(Fail)
        .onSuccess(Fail).failure
    ).toBe(0);

    expect(
      Succeed(1)
        .onFailure(Fail)
        .onSuccess(JSON.stringify)
        .onFailure(Succeed)
        .onFailure(Fail)
        .onSuccess(Fail).failure
    ).toBe('1');
  });
});

describe('Getters', () => {
  describe('.status', () => {
    test.each([...['🍕', 9, {}, [9]]])('should be Ok for %p', value =>
      expect(Try(value as never).status).toEqual(Ok)
    );

    test.each([...[false, null, undefined, 0, -0, ''].map(v => [Failed, v])])(
      'should be Fail for %p',
      value => expect(Try(value as never).status).toEqual(Failed)
    );
  });

  describe('.failure', () => {
    test.each(truthyValues.map(v => [v, v]))(
      'should throw for Succeeded<%p>',
      value => expect(() => Try(value as never).failure).toThrow()
    );

    test.each(falsyValues.map(v => [v, v]))(
      'should morph %p into Failed<%p>',
      value => expect(Try(value as never)).toMatchObject({ failure: value })
    );
  });

  describe('.success', () => {
    test.each(truthyValues.map(v => [v, v]))(
      'should morph %p into Succeeded<%p>',
      value => expect(Try(value as never)).toMatchObject({ success: value })
    );

    test.each(falsyValues.map(v => [v, v]))(
      'should throw for for Failed<%p>',
      value => expect(() => Try(value as never).success).toThrow()
    );
  });

  describe('.future', () => {
    describe('should morph a value into an async outcome', () => {
      it('should morph Success<"🌯"> into a Future<"🌯">', async () =>
        expect(await Succeed('🌯').future).toMatchObject({ success: '🌯' }));

      it('should morph Failure<"🌮"> into a Future<Error("🌮")>', async () =>
        expect(await Fail('🌮').future).toMatchObject({
          failure: '🌮',
        }));
    });

    describe('should morph an async value into an async outcome', () => {
      it('should morph Promise.resolve(1) into Succeeded<1>', async () =>
        expect(await Try(Promise.resolve(1)).future).toMatchObject({
          success: 1,
        }));

      it('should morph Promise.resolve(0) into Failed<Error("1")>', async () =>
        expect(await Try(Promise.reject(0)).future).toMatchObject({
          failure: new Error('0'),
        }));
    });
  });
});

describe('Methods', () => {
  describe('.onSuccess', () => {
    it('should morph "🍕" into "🥃"', () =>
      expect(Succeed('🍕').onSuccess(void_ => '🥃')).toMatchObject({
        success: '🥃',
      }));

    it('should not be able to morph a failure', () =>
      expect(Fail('🍕').onSuccess(void_ => '🥃')).toMatchObject({
        failure: '🍕',
      }));

    it('should flatten result return types', () => {
      expect(Succeed('🍕').onSuccess(void_ => Fail('🥃'))).toMatchObject({
        failure: '🥃',
      });
      expect(Fail('🍕').onSuccess(void_ => Succeed('🥃'))).toMatchObject({
        failure: '🍕',
      });
    });
  });

  describe('.onFailure', () => {
    it('should morph "🍕" into "🥃"', () =>
      expect(Fail('🍕').onFailure(void_ => '🥃')).toMatchObject({
        failure: '🥃',
      }));

    it('should not be able to morph a success', () =>
      expect(Succeed('🍕').onFailure(void_ => '🥃')).toMatchObject({
        success: '🍕',
      }));

    it('should flatten result return types', () => {
      expect(Fail('🍕').onFailure(void_ => Succeed('🥃'))).toMatchObject({
        success: '🥃',
      });

      expect(Succeed('🍕').onFailure(void_ => Fail('🥃'))).toMatchObject({
        success: '🍕',
      });
    });
  });
});
