import { Outcome } from './types';

export const truthyValues = ['🍕', 9, 9n, {}, [9]];
export const falsyValues = [false, null, undefined, 0, -0, 0n, ''];

export const errors = [Error, RangeError, SyntaxError, TypeError, EvalError];
export const toError = (e: unknown): Error =>
  e instanceof Error ? e : new Error(String(e));

export const isOutcome = <S, F>(value: unknown): value is Outcome<S, F> => {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    '𝓺' in (value as Outcome<S, F>)
  );
};
