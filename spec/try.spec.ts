import { Fail, Failed, Succeed, Try } from '../src';
import { toError } from '../src/utils';

describe('Try', () => {
  it('should handle invalid dates as failures', () =>
    expect(Try(new Date('💩')).status).toBe(Failed));

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

  it('should handle arrays with nullish values', () =>
    expect(() => Try([undefined])).not.toThrow());

  it('should not nest Outcomes when chaining methods', () => {
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
