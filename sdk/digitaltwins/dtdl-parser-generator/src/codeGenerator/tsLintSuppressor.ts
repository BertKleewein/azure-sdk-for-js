// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export class TsLintSuppressor {
  private _noUnusedVars?: boolean;
  private _useInterfaceParameters?: boolean;
  private _explicitModuleBoundaryTypes?: boolean;

  noUnusedVars(): void {
    this._noUnusedVars = true;
  }

  useInterfaceParameters(): void {
    this._useInterfaceParameters = true;
  }

  explicitModuleBoundaryTypes(): void {
    this._explicitModuleBoundaryTypes = true;
  }

  toString(): string {
    let suppressions: string[] = [];
    if (this._noUnusedVars) {
      suppressions.push("@typescript-eslint/no-unused-vars");
    }
    if (this._useInterfaceParameters) {
      suppressions.push("@azure/azure-sdk/ts-use-interface-parameters");
    }
    if (this._explicitModuleBoundaryTypes) {
      suppressions.push("@typescript-eslint/explicit-module-boundary-types");
    }
    const suppressionList = suppressions.join(", ");
    if (suppressionList.length) {
      return `// eslint-disable-next-line ${suppressionList}\r\n`;
    } else {
      return "";
    }
  }
}
