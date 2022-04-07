// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TsMethod, TsFunctionType, TsParameterParams, TsScope } from "./internal";

export class TsConstructor extends TsMethod {
  constructor(isStatic: boolean) {
    if (isStatic) {
      super({
        name: "initialize",
        functionType: TsFunctionType.Method,
        isStatic: true,
        returnType: "void",
      });
    } else {
      super({ name: "constructor", functionType: TsFunctionType.Method });
    }
  }

  parameter(input: TsParameterParams): this {
    super.parameter(input);
    return this;
  }

  super(inputs: string[]): TsScope {
    const superCall = this.body.function({ name: "super", functionType: TsFunctionType.Method });
    inputs.forEach((inputName) => {
      superCall.parameter({ name: inputName });
    });

    return this.body as TsScope;
  }
}
