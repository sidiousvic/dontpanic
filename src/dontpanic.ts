import { Try } from './try';
import { Failure, Outcome, Success, 〱 } from './types';
import { toError } from './utils';

/**
 * Morphs a throwable into an `Outcome`.
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
          | 〱<Success<ReturnType<Throwable>, never>>
          | 〱<Failure<ReturnType<Throwable>, never>>
      ) as Outcome<ReturnType<Throwable>, Error>;
    } catch (e) {
      return Try(e instanceof Error ? e : toError(e)) as Outcome<
        ReturnType<Throwable>,
        Error
      >;
    }
  };
}
