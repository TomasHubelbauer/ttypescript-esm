# ttypescript ESM

This repository contains a [ttypescript](https://github.com/cevek/ttypescript)
transformer which removes URL fragment and search parts from `import` statement
module specifiers which are relative `file:` paths.

This allows using `import`s such as these:

```typescript
import a from './a?search';
import b from './b#fragment';
import c from '../../c?search#fragment';
```

The ttypescript transformer is based completely off Zoltu's transformer
[typescript-transformer-append-js-extension](https://github.com/Zoltu/typescript-transformer-append-js-extension)

My end goal here is to make it so that using fragment, search of both in the
module specifiers doesn't break TypeScript's ability to do type tracing and
interference across the module boundary; same as if the module specifier did not
contain the fragment and/or search parts to begin with. I hope to make them
invisible to the TypeScript compiler.

As of now, that goal is failing, because while I can remove these URL parts from
the final output, I can't make them invisible to the TypeScript compiler. It
seems my transformation happens too late in the process, after the type checker.

Additionally, I do not actually wish to truly remove these. I want to be able to
use TypeScript to check a JavaScript project, so only type checking is happening
and no emitting. I do not need to update the statements for emitting then, just
for the type checking phase, somehow…

I asked Zoltu for help:
https://github.com/Zoltu/typescript-transformer-append-js-extension/issues/13

Currently, I am testing this on TypeScript source files to make things simple,
because with JavaScript, I won't be using TypeScript directly, but instead thru
a VS Code language service and testing that is a little more involved. Once I
can get this to work before the type checking and not the emitting phase, I will
move onto solving it for JavaScript and testing through the language service in
VS Code (by pointing VS Code workspace settings for `tsdk` to `ttsc`).

Run using `tsc index.ts` and `npx ttsc index.ts` to see the difference.
