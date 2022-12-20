import { Fail, Succeed } from '../src';

describe('Outcome.onFailure', () => {
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
