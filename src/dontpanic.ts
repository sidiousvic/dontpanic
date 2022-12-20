import { Try } from './try';
import { Failure, Outcome, Success, Lit } from './types';
import { toError } from './utils';

/**
 *
 * Transforms a throwable into an {@link https://github.com/sidiousvic/dontpanic/blob/fcbb0045538033b7dead627998ee67e9f3eddc1c/src/types.ts#L27 Outcome}.
 *
 * If the thrown value is not an instance of `Error`, it will be transformed into one via {@link https://github.com/sidiousvic/dontpanic/blob/31a59fe0399c79269d63d5ac1c86bee7c89bed80/src/utils.ts#L7}.
 *
 * {@link https://github.com/sidiousvic/dontpanic/blob/31a59fe0399c79269d63d5ac1c86bee7c89bed80/spec/dontpanic.spec.ts Read the spec here.}
 */
export function DontPanic<
  Throwable extends (...args: Parameters<Throwable>) => ReturnType<Throwable>
>(
  fn: Throwable
): (...args: Parameters<Throwable>) => Outcome<ReturnType<Throwable>, Error> {
  return (...args: Parameters<Throwable>) => {
    try {
      return Try(
        fn(...args) as
          | Lit<Success<ReturnType<Throwable>, never>>
          | Lit<Failure<ReturnType<Throwable>, never>>
      ) as Outcome<ReturnType<Throwable>, Error>;
    } catch (e) {
      return Try(e instanceof Error ? e : toError(e)) as Outcome<
        ReturnType<Throwable>,
        Error
      >;
    }
  };
}
