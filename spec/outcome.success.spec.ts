import { Try } from '../src';
import { falsyValues, truthyValues } from '../src/utils';

describe('Outcome.success', () => {
  test.each(truthyValues.map(v => [v, v]))(
    'should morph %p into Succeeded<%p>',
    value => expect(Try(value as never)).toMatchObject({ success: value })
  );

  test.each(falsyValues.map(v => [v, v]))(
    'should throw for for Failed<%p>',
    value => expect(() => Try(value as never).success).toThrow()
  );
});
