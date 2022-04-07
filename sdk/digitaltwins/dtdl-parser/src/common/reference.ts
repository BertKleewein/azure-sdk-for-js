// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type Reference<T> = { ref: T | undefined };
export function referenceInit<T>(): Reference<T> {
  return { ref: undefined };
}
