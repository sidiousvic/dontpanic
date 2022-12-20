import { Failed, Ok, Try } from '../src';

describe('Outcome.status', () => {
  test.each([...['🍕', 9, {}, [9]]])('should be Ok for %p', value =>
    expect(Try(value as never).status).toEqual(Ok)
  );

  test.each([...[false, null, undefined, 0, -0, ''].map(v => [Failed, v])])(
    'should be Fail for %p',
    value => expect(Try(value as never).status).toEqual(Failed)
  );
});
