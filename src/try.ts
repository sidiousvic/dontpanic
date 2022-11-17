import { Status, Outcome, 〱, Future, Failure, Success } from './types';
import { isOutcome, toError } from './utils';

/**
 * Morphs values into `Outcome`s.
 */
export function Try<Su, Fa, St>(
  value: 〱<Su> | 〱<Fa>,
  status?: Status
): Outcome<Success<〱<Su>, St>, Failure<〱<Fa>, St>> {
  if (Array.isArray(value) && value.length && value.every(v => isOutcome(v))) {
    return (value as Outcome<unknown, unknown>[]).reduce<
      Outcome<unknown, unknown>
    >((unified, outcome) => {
      return unified.status === Ok
        ? Try(
            [
              ...(unified.success as 〱<Success<unknown, unknown>>[]),
              outcome.status === Ok ? outcome.success : outcome.failure,
            ] as 〱<Success<unknown, unknown>>,
            outcome.status
          )
        : Try((unified.failure as unknown[]).pop() as 〱<Su> | 〱<Fa>);
    }, Try([] as never)) as Outcome<Success<〱<Su>, St>, Failure<〱<Fa>, St>>;
  }

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
      if (s === Failed) return v as Fa as Failure<〱<Fa>, St>;
      throw new Error();
    },
    success() {
      if (s === Ok) return v as Su as Success<〱<Su>, St>;
      throw new Error();
    },
    future() {
      return (
        v instanceof Promise
          ? v
              .then(awaited => Try(awaited as 〱<Su> | 〱<Fa>))
              .catch(e => Try(toError(e)))
          : Promise.resolve(Try(v as 〱<Su>, s))
      ) as Promise<
        Outcome<Future<Success<〱<Su>, St>>, Future<Failure<〱<Fa>, St>>>
      >;
    },
    onSuccess<M>(fn: (v: Success<〱<Su>, St>) => 〱<M>) {
      return Try(
        s === Ok ? fn(v as Success<〱<Su>, St>) : (v as 〱<Fa>),
        s
      ) as Outcome<M, Failure<〱<Fa>, St>>;
    },
    onFailure<M>(fn: (v: Failure<〱<Fa>, St>) => 〱<M>) {
      return Try(
        s === Failed ? fn(v as Failure<〱<Fa>, St>) : (v as 〱<Su>),
        s
      ) as Outcome<Success<〱<Su>, St>, M>;
    },
  };

  const { failure, success, future, onSuccess, onFailure } = core;

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
    onSuccess,
    onFailure,
  };

  return outcome as Outcome<Success<〱<Su>, St>, Failure<〱<Fa>, St>>;
}

export function Succeed<Su>(value: 〱<Su>): Outcome<Su, never> {
  return Try(value as 〱<Success<Su, never>>, Ok);
}

export function Fail<Fa>(value: 〱<Fa>): Outcome<never, Fa> {
  return Try(value as 〱<Failure<Fa, never>>, Failed);
}
export const Ok = Status.Succeeded;
export const Failed = Status.Failed;
