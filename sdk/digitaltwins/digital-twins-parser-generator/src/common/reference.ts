// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type Reference<T> = { ref: T | undefined };
export const referenceInit = () => {
  return { ref: undefined };
};
