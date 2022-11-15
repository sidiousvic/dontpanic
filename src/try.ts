import { Status, Outcome, 〱, Future, Failure, Success } from './types';
import { isOutcome, toError } from './utils';

/**
 * Morphs values into `Outcome`s.
 */
export function Try<Su, Fa, St>(
  value: 〱<Su> | 〱<Fa>,
  status?: Status
): Outcome<Success<〱<Su>, St>, Failure<〱<Fa>, St>> {
  if (
    Array.isArray(value) &&
    value.length &&
    value.every(v => (v as Outcome<unknown, unknown>).status !== undefined)
  ) {
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

  const s =
    status !== undefined
      ? status
      : [
          value instanceof Date && !isFinite(value.getTime()),
          typeof value === 'bigint' && isNaN(Number(value)),
          typeof value === 'number' && isNaN(value),
          value instanceof Error,
          !value,
        ].some(Boolean)
      ? Status.Failed
      : Status.Succeeded;

  const core = {
    failure() {
      if (s === Failed) return value as Fa as Failure<〱<Fa>, St>;
      throw new Error();
    },
    success() {
      if (s === Ok) return value as Su as Success<〱<Su>, St>;
      throw new Error();
    },
    future() {
      return (
        value instanceof Promise
          ? value
              .then(awaited => Try(awaited as 〱<Su> | 〱<Fa>))
              .catch(e => Try(toError(e)))
          : Promise.resolve(Try(value, s))
      ) as Promise<
        Outcome<Future<Success<〱<Su>, St>>, Future<Failure<〱<Fa>, St>>>
      >;
    },
    onSuccess<M>(fn: (value: Success<〱<Su>, St>) => M) {
      if (isOutcome<Su, Fa>(fn(null as never)))
        return s === Ok ? fn(value as Success<〱<Su>, St>) : Try(value, s);
      return Try(
        s === Ok
          ? (fn(value as Success<〱<Su>, St>) as 〱<M>)
          : (value as 〱<Fa>),
        s
      );
    },
    onFailure<M>(fn: (value: Failure<〱<Fa>, St>) => M) {
      if (isOutcome<Su, Fa>(fn(null as never)))
        return s === Failed ? fn(value as Failure<〱<Fa>, St>) : Try(value, s);
      return Try(
        s === Failed
          ? (fn(value as Failure<〱<Fa>, St>) as 〱<M>)
          : (value as 〱<Su>),
        s
      );
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
