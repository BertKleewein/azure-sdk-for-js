// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { ContentInfo } from "./contentInfo";
import { ContentKinds } from "./contentKinds";
import { LanguageStringType } from "./type";
import { Parser } from "./parser";
import { ParserCollection } from "./parserCollection";
import { SupplementalTypeInfo } from "./supplementalTypeInfo";
import { InDTMI } from "./internalDtmi";
import { Model } from "./model";
import { ParsingError } from "./parsingError";
import { Reference } from "../common/reference";
export abstract class ContentInfoImpl implements ContentInfo, TypeChecker {
  public dtdlVersion: number;
  public id: string;
  public childOf: string | undefined;
  public definedIn: string | undefined;
  public entityKind: ContentKinds;
  public comment?: string;
  public description?: LanguageStringType;
  public displayName?: LanguageStringType;
  public languageVersion?: number;
  public name?: string;
  public namePropertyRegexPatternV2: RegExp = /^[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?$/;
  public namePropertyRegexPatternV3: RegExp = /^[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?$/;
  public parserClass: Parser = ParserCollection.ContentInfoParser;
  public supplementalTypeIds: string[];
  public supplementalProperties: { [x: string]: any };
  public supplementalTypes: SupplementalTypeInfo[];
  public undefinedTypes: string[];
  public undefinedProperties: { [name: string]: any };
  public sourceObject: any;
  public isPartition: boolean;
  protected static _versionlessTypes: Set<string>;
  protected _checkedForDescendantSchemaOrContentsComponentNarrow: boolean;
  protected _idOfDescendantSchemaOrContentsComponentNarrow: InDTMI | undefined;
  protected _checkedDescendantEnumValueDatatype: string | undefined;
  protected _checkedForDescendantSchemaArray: boolean;
  protected _idOfDescendantSchemaArray: InDTMI | undefined;

  constructor(
    dtdlVersion: number,
    id: string,
    childOf: string | undefined,
    definedIn: string | undefined,
    entityKind: ContentKinds
  ) {
    this.dtdlVersion = dtdlVersion;
    this.id = id;
    this.childOf = childOf;
    this.definedIn = definedIn;
    this.entityKind = entityKind;
    this.description = {};
    this.displayName = {};
    this.supplementalTypeIds = [];
    this.supplementalProperties = {};
    this.supplementalTypes = [];
    this.isPartition = false;
    this.undefinedTypes = [];
    this.undefinedProperties = {};
    this._checkedForDescendantSchemaOrContentsComponentNarrow = false;
    this._idOfDescendantSchemaOrContentsComponentNarrow = undefined;
    this._checkedDescendantEnumValueDatatype = undefined;
    this._checkedForDescendantSchemaArray = false;
    this._idOfDescendantSchemaArray = undefined;
  }

  public static initialize(): void {
    this._versionlessTypes = new Set<string>()
      .add("dtmi:dtdl:class:Content")
      .add("dtmi:dtdl:class:Entity")
      .add("dtmi:dtdl:class:NamedEntity");
  }

  public addType(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dtmi: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    supplementalType: SupplementalTypeInfo | undefined
  ): void {
    throw new Error("Attempt to add type to non augmentable type ContentInfo");
  }

  doesHaveType(typeId: string): boolean {
    return ContentInfoImpl._versionlessTypes.has(new InDTMI(typeId).versionless);
  }

  doesPropertyDictContainKey(
    propertyName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key: string | undefined
  ): boolean {
    switch (propertyName) {
      default:
        return false;
    }
  }

  public validateInstance(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceText: string
  ): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  public validateInstanceElement(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown
  ): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  public validateInstanceInternal(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  public validateInstanceV2(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  public validateInstanceV3(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  /**
   * Set partition information.
   **/
  setPartitionInfo(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    partitionJsonText: string
  ): void {
    throw new Error(`attempt to set partition info on non-partition type ContentInfoInfo`);
  }

  applyTransformationsV2(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void // eslint-disable-next-line @typescript-eslint/no-empty-function
  {}

  applyTransformationsV3(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void // eslint-disable-next-line @typescript-eslint/no-empty-function
  {}

  checkRestrictionsV2(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void // eslint-disable-next-line @typescript-eslint/no-empty-function
  {}

  checkRestrictionsV3(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void // eslint-disable-next-line @typescript-eslint/no-empty-function
  {}

  trySetObjectProperty(
    propertyName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
    value: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key: string | undefined
  ): boolean {
    switch (propertyName) {
      default:
        break;
    }
    return false;
  }

  /**
   * Check the nesting depth of all descendant elementSchema or schema properties.
   **/
  checkDepthOfElementSchemaOrSchema(
    depth: number,
    depthLimit: number,
    tooDeepElementId: Reference<InDTMI>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): boolean {
    tooDeepElementId.ref = undefined;
    return true;
  }

  tryGetDescendantSchemaOrContentsComponentNarrow(elementId: Reference<InDTMI>): boolean {
    if (this._checkedForDescendantSchemaOrContentsComponentNarrow) {
      elementId.ref = this._idOfDescendantSchemaOrContentsComponentNarrow;
      return this._idOfDescendantSchemaOrContentsComponentNarrow !== undefined;
    }

    this._checkedForDescendantSchemaOrContentsComponentNarrow = true;

    elementId.ref = undefined;
    return false;
  }

  checkDescendantEnumValueDataType(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    ancestorId: InDTMI,
    datatype: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void {
    if (this._checkedDescendantEnumValueDatatype !== datatype) {
      this._checkedDescendantEnumValueDatatype = datatype;
    }
  }

  tryGetDescendantSchemaArray(elementId: Reference<InDTMI>): boolean {
    if (this._checkedForDescendantSchemaArray) {
      elementId.ref = this._idOfDescendantSchemaArray;
      return this._idOfDescendantSchemaArray !== undefined;
    }

    this._checkedForDescendantSchemaArray = true;

    elementId.ref = undefined;
    return false;
  }

  getCountOfExtendsNarrow(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): number {
    throw new Error("Can not execute on an abstract class");
  }

  getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): number {
    throw new Error("Can not execute on an abstract class");
  }
}
