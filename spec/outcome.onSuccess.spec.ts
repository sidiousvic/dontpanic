import { Fail, Succeed } from '../src';

describe('Outcome.onSuccess', () => {
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
