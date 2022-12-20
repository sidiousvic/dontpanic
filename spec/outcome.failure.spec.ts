import { Try } from '../src';
import { falsyValues, truthyValues } from '../src/utils';

describe('Outcome.failure', () => {
  test.each(truthyValues.map(v => [v, v]))(
    'should throw for Succeeded<%p>',
    value => expect(() => Try(value as never).failure).toThrow()
  );

  test.each(falsyValues.map(v => [v, v]))(
    'should morph %p into Failed<%p>',
    value => expect(Try(value as never)).toMatchObject({ failure: value })
  );
});
