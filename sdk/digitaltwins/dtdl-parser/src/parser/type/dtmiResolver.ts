// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type DtmiResolver = (
  dtmis: string | string[],
  options?: unknown
) => Promise<{ [dtmi: string]: unknown }>;
