# ๐ฏ dontpanic

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

## Introduction

Humans are known to panic. This is widely considered bad design.

```ts
function eat(f: string) {
  if (f === '๐ฏ') ...
  else throw; // panic
}
```

Panic is not usefulโข. What's useful is a **thorough assessment of the circumstances**. `dontpanic` brings you _blazingly steadfast_ abstractions that help you recover from failure and guide your code to success.

```ts
DontPanic(eat)('๐ฏ').onSuccess(sleep).onFailure(getPizza); // ๐ Don't panic
```

## Principles

### ๐ฏ No littering

Unhandled `throw`s crash your program and send it into an unrecoverable state.

```ts
throw new Error('Invalid input'); // ๐ฏ Crash risk

return Failed('Invalid input'); // ๐ฃ  No crash risk
```

99.9% of the time there is no need to panic.

### โ ๏ธ Explicit content

Throwable functions do not encode potential in their type signature.

```ts
const parsed = JSON.stringify(input); // โ ๏ธ Number, may crash

DontPanic(JSON.stringify)(input); // โ  Outcome<string, Error>
```

Explicit is better than implicit.

### ๐ฅ Flat as a pancake

Try/catch creates new execution scopes.

```ts
try {
  const parsed = JSON.parse(input);
  try {
    const validated = validateInput(parsed);
    register(validated);
  } catch (e) {
    handleValidationError(e);
  }
} catch (e) {
  handleParsingError(e); // ๐ชน Far away from home
}

DontPanic(JSON.parse)(input) // ๐ฅ
  .onFailure(handleParsingError)
  .onSuccess(validateInput)
  .onFailure(handleValidationError)
  .onSuccess(register);
```

Flatten your error handling.

## Install

```bash
npm install @sidiousware/dontpanic
```

[build-img]: https://github.com/sidiousvic/dontpanic/actions/workflows/release.yml/badge.svg?branch=main
[build-url]: https://github.com/sidiousvic/dontpanic/actions/workflows/release.yml?branch=main
[npm-img]: https://img.shields.io/npm/v/dontpanic
[npm-url]: https://www.npmjs.com/package/dontpanic
[codecov-img]: https://codecov.io/gh/sidiousvic/dontpanic/branch/prod/graph/badge.svg
[codecov-url]: https://codecov.io/gh/sidiousvic/dontpanic
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
