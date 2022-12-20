/**
 * Represents the literal representation of a type.
 */
export type Lit<U> = U extends any ? (any extends U ? never : U) : never;

/**
 * Defines the union of literal falsey primitives.
 */
export type Falsey = false | null | undefined | 0 | 0n | '';

/**
 * Represents a promise's wrapped value.
 */
export type Future<U> = U extends Promise<infer V> ? V : U;

/**
 * Enumerates the failed and success states.
 */
export enum Status {
  Failed,
  Succeeded,
}

/**
 * Represents an outcome which may have failed or succeeded.
 */
export type Outcome<Su, Fa> = {
  status: Status;
  /**
   * Unrwaps a failed value.
   *
   * 🚨 Will throw if the Outcome is a success.
   */
  failure: Fa;
  /**
   * Unrwaps a successful value.
   *
   * 🚨 Will throw if the Outcome is a failure.
   */
  success: Su;
  /**
   * Given an {@link https://github.com/sidiousvic/dontpanic/blob/fcbb0045538033b7dead627998ee67e9f3eddc1c/src/types.ts#L27 Outcome} which wraps a Promise value, awaits the value and promisifies the Outcome itself for simpler async flow.
   *
   * {@link https://github.com/sidiousvic/dontpanic/blob/31a59fe0399c79269d63d5ac1c86bee7c89bed80/spec/try.future.spec.ts Read the spec here.}
   */
  future: Promise<Outcome<Future<Su>, Future<Fa>>>;
  /**
   * Given an {@link https://github.com/sidiousvic/dontpanic/blob/fcbb0045538033b7dead627998ee67e9f3eddc1c/src/types.ts#L27 Outcome} which wraps a list of Outcomes, if all are succesful unwraps a list of the values as a success, and else unwraps the first failed value as a failure.
   *
   * {@link https://github.com/sidiousvic/dontpanic/blob/31a59fe0399c79269d63d5ac1c86bee7c89bed80/spec/outcome.unify.spec.ts Read the spec here.}
   */
  unify: Outcome<
    Su | Fa extends Array<Outcome<infer S, infer void_F>> ? S[] : Su[],
    Su | Fa extends Array<Outcome<infer void_S, infer F>> ? F : Fa
  >;
  /**
   * Maps the contained value when the Outcome is successful.
   *
   * {@link https://github.com/sidiousvic/dontpanic/blob/31a59fe0399c79269d63d5ac1c86bee7c89bed80/spec/outcome.onSuccess.spec.ts Read the spec here.}
   */
  onSuccess<M>(fn: (value: Su) => M): Outcome<M, Fa>;
  /**
   * Maps the contained value when the Outcome is a failure.
   * {@link https://github.com/sidiousvic/dontpanic/blob/31a59fe0399c79269d63d5ac1c86bee7c89bed80/spec/outcome.onFailure.spec.ts Read the spec here.}
   */
  onFailure<M>(fn: (value: Fa) => M): Outcome<Su, M>;
};

/**
 * Represents the value inside a nested Outcome.
 */
export type Flat<U> = U extends Outcome<infer S, never>
  ? S
  : U extends Outcome<never, infer F>
  ? F
  : U;

/**
 * Represents a successful outcome.
 */
export type Success<U, St> = St extends Status.Failed
  ? never
  : Flat<U> extends Falsey | Error
  ? never
  : Flat<U>;

/**
 *  Represents a failed outcome.
 */
export type Failure<U, St> = St extends Status.Succeeded
  ? never
  : Flat<U> extends Falsey | Error
  ? Flat<U>
  : never;
