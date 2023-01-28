# Refactoring

## Overview

- [x] Refactor provided code to TypeScript.
- [x] Make Jest collect coverage.
- [x] Add tests to cover all branches of the function.
- [x] Refactor the function to make it more readable and less nested.

## Explanation

### TypeScript

- Challenge description states that «_we do like to use the latest JS language features when applicable_».
- So, it can be fun to take interpretation of it to extreme and refactor provided code to TypeScript.
  - To be fair, TypeScript can be considered as a de facto latest language syntax, right? :)
- We make the assumption that `event` argument is either of type `object` or `undefined` (from provided usage in `index.js`).

### Code Coverage

- «_Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it_».
- We can make the safest bet by writing unit tests to cover 100% of the code. 💯

### Tests

- We add a couple of tests to cover all branches of the function.
  - «_Returns provided `partitionKey` when it is string_» test doesn't contribute to coverage, but we keep it for more explicit specification.
- We don't add tests for «_deterministic_» behavior because our hash computation is deterministic on its own.

|                                                      before                                                       |                                                      after                                                       |
| :---------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
| ![before](https://user-images.githubusercontent.com/123782656/215242753-a36c04f3-e8c3-44fb-a26f-3c44d4096324.png) | ![after](https://user-images.githubusercontent.com/123782656/215242752-f4caec68-8f6f-4df8-80bb-9e419e936ef4.png) |

### Refactoring

- Using tests as main spec, we can refactor the function to make it less nested with the “early returns” pattern.
- Using the “DRY” pattern, we add an alias for `crypto.createHash("sha3-512").update(…).digest("hex")` to make it more readable.
- Also, we make the safe assumption that this hash string will always be shorter than the limit because SHA3-512 always produces $512 / 8 = 64$ bytes hash, and the hexadecimal representation of it is $64 * 2 = 128$ characters long.
