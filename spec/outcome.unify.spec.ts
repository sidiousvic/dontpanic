import { Try } from '../src';

describe('Outcome.unify', () => {
  it('should morph a list of successful outcomes into a list of their contained values', () =>
    expect(Try([Try(1), Try(2), Try(3)]).unify).toMatchObject({
      success: [1, 2, 3],
    }));

  it("should morph a list with at least one failed outcome into the first failed outcome's value", () =>
    expect(Try([Try(1), Try(0), Try(3)]).unify).toMatchObject({
      failure: 0,
    }));
});
