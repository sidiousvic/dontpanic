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
  future: Promise<Outcome<Future<Su>, Future<Fa>>>;
  onSuccess<M>(fn: (value: Su) => M): Outcome<M, Fa>;
  onFailure<M>(fn: (value: Fa) => M): Outcome<Su, M>;
};

/**

  * Represents a successful outcome.
 */
export type Success<U, St> = St extends Status.Failed
  ? never
  : U extends Falsey | Error
  ? never
  : U;

/**
 *  Represents a failed outcome.
 */
export type Failure<U, St> = St extends Status.Succeeded
  ? never
  : U extends Falsey | Error
  ? U
  : never;
