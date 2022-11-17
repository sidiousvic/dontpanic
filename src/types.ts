/**
 * Narrows a type into its literal.
 */
export type 〱<U> = U extends any ? (any extends U ? never : U) : never;

/**
 * Defines the union of literal falsey primitives.
 */
export type Falsey = false | null | undefined | 0 | 0n | '';

/**
 * Unwraps a promise into its wrapped value.
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
  failure: Fa;
  success: Su;
  future: Promise<Outcome<Future<Su>, Future<Fa> | RejectionError>>;
  unify: Outcome<
    Su | Fa extends Array<Outcome<infer S, infer void_F>> ? S[] : Su[],
    Su | Fa extends Array<Outcome<infer void_S, infer F>> ? F : Fa
  >;
  onSuccess<M>(fn: (value: Su) => M): Outcome<M, Fa>;
  onFailure<M>(fn: (value: Fa) => M): Outcome<Su, M>;
};

/**
 * Flattens an outcome.
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

/**
 * Represents a promise rejection. The caught value is serialized as the message of a new error object.
 */
export class RejectionError extends Error {
  name = 'RejectionError';

  constructor(e: unknown) {
    super(String(e));
  }
}
