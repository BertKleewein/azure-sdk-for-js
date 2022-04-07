// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { DateInfo } from "./dateInfo";
import { DateKinds } from "./dateKinds";
import { LanguageStringType } from "./type";
import { SupplementalTypeInfo } from "./supplementalTypeInfo";
import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { InDTMI } from "./internalDtmi";
import { Model } from "./model";
import { ParsingError } from "./parsingError";
import { Reference } from "../common/reference";
import { TraversalStatus } from "./enum";
import { createParsingError } from "./parsingErrorImpl";
export class DateInfoImpl implements DateInfo, TypeChecker {
  public dtdlVersion: number;
  public id: string;
  public childOf: string | undefined;
  public definedIn: string | undefined;
  public entityKind: DateKinds;
  public comment?: string;
  public description?: LanguageStringType;
  public displayName?: LanguageStringType;
  public languageVersion?: number;
  public parserClass: any;
  public supplementalTypeIds: string[];
  public supplementalProperties: { [x: string]: any };
  public supplementalTypes: SupplementalTypeInfo[];
  public undefinedTypes: string[];
  public undefinedProperties: { [name: string]: any };
  public sourceObject: any;
  public _elementValueInstanceRegexPatternV2: RegExp = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
  public _elementValueInstanceRegexPatternV3: RegExp = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
  public isPartition: boolean;
  protected static _versionlessTypes: Set<string>;
  protected _checkedForDescendantSchemaOrContentsComponentNarrow: boolean;
  protected _idOfDescendantSchemaOrContentsComponentNarrow: InDTMI | undefined;
  protected _checkedDescendantEnumValueDatatype: string | undefined;
  protected _checkedForDescendantSchemaArray: boolean;
  protected _idOfDescendantSchemaArray: InDTMI | undefined;
  protected _countOfExtendsNarrowStatus: TraversalStatus;
  protected _countOfExtendsNarrowValue: number;
  protected _countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus: TraversalStatus;
  protected _countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue: number;

  constructor(
    dtdlVersion: number,
    id: string,
    childOf: string | undefined,
    definedIn: string | undefined,
    entityKind: DateKinds,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    parserClass: any
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
    this.parserClass = parserClass;
    this.isPartition = false;
    this.undefinedTypes = [];
    this.undefinedProperties = {};
    this._checkedForDescendantSchemaOrContentsComponentNarrow = false;
    this._idOfDescendantSchemaOrContentsComponentNarrow = undefined;
    this._checkedDescendantEnumValueDatatype = undefined;
    this._checkedForDescendantSchemaArray = false;
    this._idOfDescendantSchemaArray = undefined;
    this._countOfExtendsNarrowStatus = TraversalStatus.NotStarted;
    this._countOfExtendsNarrowValue = 0;
    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.NotStarted;
    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue = 0;
  }

  static initialize(): void {
    this._versionlessTypes = new Set<string>()
      .add("dtmi:dtdl:class:Date")
      .add("dtmi:dtdl:class:Entity")
      .add("dtmi:dtdl:class:PrimitiveSchema")
      .add("dtmi:dtdl:class:Schema")
      .add("dtmi:dtdl:class:TemporalSchema");
  }

  public addType(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dtmi: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    supplementalType: SupplementalTypeInfo | undefined
  ): void {
    this.supplementalTypeIds.push(dtmi);
    if (supplementalType !== undefined) {
      this.supplementalTypes.push(supplementalType);
    }
  }

  doesHaveType(typeId: string): boolean {
    return (
      DateInfoImpl._versionlessTypes.has(new InDTMI(typeId).versionless) ||
      this.supplementalTypes.some((st) => (st as SupplementalTypeInfoImpl).doesHaveType(typeId))
    );
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
    const instanceElt = JSON.parse(instanceText);
    return this.validateInstanceElement(instanceElt);
  }

  public validateInstanceElement(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown
  ): boolean {
    return this.validateInstanceInternal(instanceElt, undefined);
  }

  public validateInstanceInternal(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    switch (this.dtdlVersion) {
      case 2: {
        return this.validateInstanceV2(instanceElt, instanceName);
      }

      case 3: {
        return this.validateInstanceV3(instanceElt, instanceName);
      }
    }

    return false;
  }

  public validateInstanceV2(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    if (typeof instanceElt !== "string") {
      return false;
    }

    if (isNaN(Date.parse(instanceElt.toString()))) {
      return false;
    }

    if (!this._elementValueInstanceRegexPatternV2.test(instanceElt.toString())) {
      return false;
    }

    return true;
  }

  public validateInstanceV3(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    if (typeof instanceElt !== "string") {
      return false;
    }

    if (isNaN(Date.parse(instanceElt.toString()))) {
      return false;
    }

    if (!this._elementValueInstanceRegexPatternV3.test(instanceElt.toString())) {
      return false;
    }

    return true;
  }

  /**
   * Set partition information.
   **/
  setPartitionInfo(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    partitionJsonText: string
  ): void {
    throw new Error(`attempt to set partition info on non-partition type DateInfoInfo`);
  }

  applyTransformations(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void // eslint-disable-next-line @typescript-eslint/no-empty-function
  {
    if (this.dtdlVersion === 2) {
      this.applyTransformationsV2(model, parsingErrors);
    }

    if (this.dtdlVersion === 3) {
      this.applyTransformationsV3(model, parsingErrors);
    }
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

  checkRestrictions(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void // eslint-disable-next-line @typescript-eslint/no-empty-function
  {
    if (this.dtdlVersion === 2) {
      this.checkRestrictionsV2(parsingErrors);
    }

    if (this.dtdlVersion === 3) {
      this.checkRestrictionsV3(parsingErrors);
    }
  }

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
    for (const supplementalType of this.supplementalTypes) {
      if (
        (supplementalType as SupplementalTypeInfoImpl).trySetObjectProperty(
          propertyName,
          value,
          key,
          this.supplementalProperties
        )
      ) {
        return true;
      }
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

  getTransitiveExtendsNarrow(
    depth: number,
    depthLimit: number,
    tooDeepElementId: Reference<InDTMI>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): Set<string> | undefined {
    const closure: Set<string> = new Set<string>();

    tooDeepElementId.ref = undefined;
    return closure;
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

  getCountOfExtendsNarrow(parsingErrors: ParsingError[]): number {
    if (this._countOfExtendsNarrowStatus === TraversalStatus.Complete) {
      return this._countOfExtendsNarrowValue;
    }

    if (this._countOfExtendsNarrowStatus === TraversalStatus.InProgress) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:recursiveStructure", {
          cause: `{primaryId:n} is at the root of a hierarchy that includes itself.`,
          action: `Change the value of one or more 'extends' properties in the hierarchy to remeve the recursion.`,
          primaryId: this.id
        })
      );
      return 0;
    }

    this._countOfExtendsNarrowStatus = TraversalStatus.InProgress;
    this._countOfExtendsNarrowStatus = TraversalStatus.Complete;
    return this._countOfExtendsNarrowValue;
  }

  getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
    parsingErrors: ParsingError[]
  ): number {
    if (
      this
        ._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus ===
      TraversalStatus.Complete
    ) {
      return this
        ._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue;
    }

    if (
      this
        ._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus ===
      TraversalStatus.InProgress
    ) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:recursiveStructure", {
          cause: `{primaryId:n} is at the root of a hierarchy that includes itself.`,
          action: `Change the value of one or more 'contents' or 'fields' or 'enumValues' or 'request' or 'response' or 'properties' or 'schema' or 'elementSchema' or 'mapValue' properties in the hierarchy to remeve the recursion.`,
          primaryId: this.id
        })
      );
      return 0;
    }

    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.InProgress;
    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.Complete;
    return this
      ._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue;
  }
}

DateInfoImpl.initialize();
