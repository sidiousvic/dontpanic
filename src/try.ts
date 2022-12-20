import { Status, Outcome, Lit, Failure, Success } from './types';
import { isOutcome } from './utils';

/**
 * Morphs a value into an {@link https://github.com/sidiousvic/dontpanic/blob/fcbb0045538033b7dead627998ee67e9f3eddc1c/src/types.ts#L27 Outcome}.
 *
 * Falsy values, invalid dates, NaNs and Error objects will result in a failure. All else is considered a success.
 *
 * Takes an optional `status` parameter which will define the status of the Outcome.
 *
 * If the value is already an Outcome, consumes the inner value of the Outcome.
 * {@link https://github.com/sidiousvic/dontpanic/blob/31a59fe0399c79269d63d5ac1c86bee7c89bed80/spec/try.spec.ts Read the spec here.}
 *
 */
export function Try<Su, Fa, St>(
  value: Lit<Su> | Lit<Fa>,
  status?: Status
): Outcome<Success<Lit<Su>, St>, Failure<Lit<Fa>, St>> {
  const v = isOutcome<Su, Fa>(value)
    ? value.status === Ok
      ? value.success
      : value.failure
    : value;

  const s =
    status !== undefined
      ? isOutcome<Su, Fa>(value)
        ? value.status
        : status
      : [
          v instanceof Date && !isFinite(v.getTime()),
          typeof v === 'bigint' && isNaN(Number(v)),
          typeof v === 'number' && isNaN(v),
          v instanceof Error,
          !v,
        ].some(Boolean)
      ? Status.Failed
      : Status.Succeeded;

  const core = {
    failure() {
      if (s === Failed) return v as Fa as Failure<Lit<Fa>, St>;
      throw new Error();
    },
    success() {
      if (s === Ok) return v as Su as Success<Lit<Su>, St>;
      throw new Error();
    },
    future() {
      return v instanceof Promise
        ? v
            .then(awaited => Try(awaited as Lit<Su>, Status.Succeeded))
            .catch(t => Try(t as never, Status.Failed))
        : Promise.resolve(Try(v as Lit<Su>, s));
    },
    onSuccess<M>(fn: (v: Success<Lit<Su>, St>) => Lit<M>) {
      return Try(
        s === Ok ? fn(v as Success<Lit<Su>, St>) : (v as Lit<Fa>),
        s
      ) as Outcome<M, Failure<Lit<Fa>, St>>;
    },
    onFailure<M>(fn: (v: Failure<Lit<Fa>, St>) => Lit<M>) {
      return Try(
        s === Failed ? fn(v as Failure<Lit<Fa>, St>) : (v as Lit<Su>),
        s
      ) as Outcome<Success<Lit<Su>, St>, M>;
    },
    unify() {
      if (Array.isArray(v) && v.length && v.every(v => isOutcome(v))) {
        return (v as Outcome<unknown, unknown>[]).reduce<
          Outcome<unknown, unknown>
        >((unified, outcome) => {
          return unified.status === Ok
            ? Try(
                [
                  ...(unified.success as Lit<Success<Su, St>>[]),
                  outcome.status === Ok ? outcome.success : outcome.failure,
                ] as Lit<Success<Su, St>>,
                outcome.status
              )
            : Try(
                (Array.isArray(unified.failure)
                  ? unified.failure.pop()
                  : unified.failure) as never
              );
        }, Try([] as never)) as Success<Lit<Su>, St> | Failure<Lit<Fa>, St>;
      }
    },
  };

  const { failure, success, future, unify, onSuccess, onFailure } = core;

  const outcome = {
    𝓺: true,
    status: s,
    get failure() {
      return failure();
    },
    get success() {
      return success();
    },
    get future() {
      return future();
    },
    get unify() {
      return unify();
    },
    onSuccess,
    onFailure,
  };

  return outcome as Outcome<Success<Lit<Su>, St>, Failure<Lit<Fa>, St>>;
}

export function Succeed<Su>(value: Lit<Su>): Outcome<Su, never> {
  return Try(value as Lit<Success<Su, never>>, Ok);
}

export function Fail<Fa>(value: Lit<Fa>): Outcome<never, Fa> {
  return Try(value as Lit<Failure<Fa, never>>, Failed);
}
export const Ok = Status.Succeeded;
export const Failed = Status.Failed;
