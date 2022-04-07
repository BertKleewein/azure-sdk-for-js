// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TsFunctionBase, TsLibraryObject } from "./internal";

export class TsMethod extends TsFunctionBase {
  importObject(objectName: string, location?: string): this {
    (this.libraryObject as TsLibraryObject).importObject(objectName, location);
    return this;
  }
}
