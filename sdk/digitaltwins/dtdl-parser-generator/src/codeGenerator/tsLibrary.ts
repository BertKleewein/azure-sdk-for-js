// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CodeWriter,
  TsClass,
  TsClassParams,
  TsEnum,
  TsEnumParams,
  TsFunction,
  TsFunctionParams,
  TsInterface,
  TsInterfaceParams,
  TsMultiLine,
  TsTypeAlias,
  TsTypeAliasParams,
  pascalToCamel,
} from "./internal";
import fs from "fs";

const FILE_EXTENSION = ".ts";
const DIR_SEP = "/";
const COPYRIGHT_TEXT =
  "// Copyright (c) Microsoft Corporation.\r\n// Licensed under the MIT license.";

type TsLibraryObject = TsFunction | TsClass | TsEnum | TsInterface | TsTypeAlias;

/**
 * Class that is responsible for writing generated code to files.
 */
export class TsLibrary {
  private _outputDirectory: string;
  private _tsDataStructures: TsLibraryObject[];
  private _libraryHeader?: TsMultiLine;

  constructor(outputDir: string) {
    this._outputDirectory = outputDir;

    this._tsDataStructures = [];
  }

  libraryHeader(text: string): TsMultiLine {
    if (this._libraryHeader !== undefined) {
      throw new Error("Cannot overwrite existing library header");
    }
    const tsMultiLine = new TsMultiLine(text);
    this._libraryHeader = tsMultiLine;
    return tsMultiLine;
  }

  class(input: TsClassParams): TsClass {
    const tsClass = new TsClass(input);
    this._tsDataStructures.push(tsClass);
    return tsClass;
  }

  function(input: TsFunctionParams): TsFunction {
    const tsFunction = new TsFunction(input);
    this._tsDataStructures.push(tsFunction);
    return tsFunction;
  }

  typeAlias(input: TsTypeAliasParams): TsTypeAlias {
    const tsTypeAlias = new TsTypeAlias(input);
    this._tsDataStructures.push(tsTypeAlias);
    return tsTypeAlias;
  }

  enum(input: TsEnumParams): TsEnum {
    const tsEnum = new TsEnum(input);
    this._tsDataStructures.push(tsEnum);
    return tsEnum;
  }

  interface(input: TsInterfaceParams): TsInterface {
    const tsInterface = new TsInterface(input);
    this._tsDataStructures.push(tsInterface);
    return tsInterface;
  }

  generateFiles(): string[] {
    const filePaths: string[] = [];
    if (!fs.existsSync(this._outputDirectory)) {
      fs.mkdirSync(this._outputDirectory);
    }
    this._tsDataStructures.forEach((type) => {
      const typeName = type.name;
      const fileName = pascalToCamel(typeName) + FILE_EXTENSION;
      const filePath = this._outputDirectory + DIR_SEP + fileName;
      filePaths.push(filePath);
      const codeWriter = new CodeWriter(filePath);

      if (this._libraryHeader !== undefined) {
        this._libraryHeader.generateCode(codeWriter);
        codeWriter.break();
      } else {
        // TODO no-empty and no-unused-vars not needed once full parser generation works.
        // Expected putput of unit Tests have been chnaged to pass as well.
        codeWriter.writeLine(COPYRIGHT_TEXT);
        codeWriter.writeLine("/* eslint-disable valid-jsdoc */");
        codeWriter.writeLine("/* eslint-disable guard-for-in */");
        codeWriter.writeLine("/* eslint-disable no-empty */");
        codeWriter.writeLine("/* eslint-disable no-unused-vars */");
        codeWriter.writeLine("/* eslint-disable sort-imports */");
        codeWriter.break();
      }
      type.generateCode(codeWriter);
    });

    return filePaths;
  }
}
