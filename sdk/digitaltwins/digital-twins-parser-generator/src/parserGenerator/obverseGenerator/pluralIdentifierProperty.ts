// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TsScope, TsClass } from "../../codeGenerator";
import { IdentifierProperty } from "./identifierProperty";
import { PropertyRepresentation } from "./propertyRepresentation";

export class PluralIdentifierProperty extends IdentifierProperty {
  public iterate(outerScope: TsScope, varName: { ref: string }): TsScope {
    return outerScope.for(`const ${varName.ref} of this.${this.propertyName} || []`);
  }
  public checkPresence(outerScope: TsScope): TsScope {
    return outerScope;
  }
  public get propertyRepresentation(): PropertyRepresentation {
    return PropertyRepresentation.List;
  }
  public get propertyType(): string | undefined {
    return "string[]";
  }

  public generateConstructorCode(_obverseClass: TsClass, ctorScope: TsScope): void {
    ctorScope.line(`this.${this.propertyName} = [];`);
  }

  public addCaseToParseSwitch(
    dtdlVersion: number,
    _obverseClass: TsClass,
    _switchScope: TsScope,
    _classIsAugmentable: boolean,
    _classIsPartition: boolean,
    _valueCountVar: string,
    _definedInVar: string
  ): void {
    if (
      Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) &&
      this.propertyDigest[dtdlVersion].allowed
    ) {
      throw new Error("Parsing logic for propertyDigest.IsPlural identifiers not written yet");
    }
  }

  public addCaseToTrySetObjectPropertySwitch(
    switchScope: TsScope,
    valueVar: string,
    _keyVar: string
  ): void {
    switchScope.line(`case '${this.propertyName}':`);
    Object.values(this.propertyNameUris).forEach((strVal) => switchScope.line(`case '${strVal}':`));
    switchScope.line(`this._${this.propertyName}.push(${valueVar}.dtmi);`).line("return true");
  }
}
