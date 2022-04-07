// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export interface TsLibraryObject {
  import(text: string): this;

  importObject(objectName: string, location?: string): this;
}
