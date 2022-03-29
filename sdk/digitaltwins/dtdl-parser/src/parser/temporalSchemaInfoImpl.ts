// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { TemporalSchemaInfo } from "./temporalSchemaInfo";
import { TemporalSchemaKinds } from "./temporalSchemaKinds";
import { EntityKinds } from "./entityKinds";
import { Reference, referenceInit } from "../common/reference";
import { LanguageStringType } from "./type";
import { SupplementalTypeInfo } from "./supplementalTypeInfo";
import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { InDTMI } from "./internalDtmi";
import { Model } from "./model";
import { ParsingError } from "./parsingError";
import { EntityInfo } from "./entityInfo";
import { createParsingError } from "./parsingErrorImpl";
export abstract class TemporalSchemaInfoImpl implements TemporalSchemaInfo, TypeChecker {
  public dtdlVersion: number;
  public id: string;
  public childOf: string | undefined;
  public definedIn: string | undefined;
  public entityKind: TemporalSchemaKinds;
  public comment?: string;
  public description?: LanguageStringType;
  public displayName?: LanguageStringType;
  public languageVersion?: number;
  public staticObjectClass: any;
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
    entityKind: TemporalSchemaKinds,
    staticObjectClass: any
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
    this.staticObjectClass = staticObjectClass;
    this.isPartition = false;
    this.undefinedTypes = [];
    this.undefinedProperties = {};
    this._checkedForDescendantSchemaOrContentsComponentNarrow = false;
    this._idOfDescendantSchemaOrContentsComponentNarrow = undefined;
    this._checkedDescendantEnumValueDatatype = undefined;
    this._checkedForDescendantSchemaArray = false;
    this._idOfDescendantSchemaArray = undefined;
  }

  static initialize() {
    this._versionlessTypes = new Set<string>()
      .add("dtmi:dtdl:class:Entity")
      .add("dtmi:dtdl:class:PrimitiveSchema")
      .add("dtmi:dtdl:class:Schema")
      .add("dtmi:dtdl:class:TemporalSchema");
  }

  public addType(dtmi: string, supplementalType: SupplementalTypeInfo | undefined): void {
    throw new Error("Attempt to add type to non augmentable type TemporalSchemaInfo");
  }

  doesHaveType(typeId: string): boolean {
    return TemporalSchemaInfoImpl._versionlessTypes.has(new InDTMI(typeId).versionless);
  }

  doesPropertyDictContainKey(propertyName: string, key: string | undefined): boolean {
    switch (propertyName) {
      default:
        return false;
    }
  }

  public validateInstance(instanceText: string): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  public validateInstanceElement(instanceElt: unknown): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  public validateInstanceInternal(instanceElt: unknown, instanceName: string | undefined): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  public validateInstanceV2(instanceElt: unknown, instanceName: string | undefined): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  public validateInstanceV3(instanceElt: unknown, instanceName: string | undefined): boolean {
    throw new Error("cannot validate anything in an abstract class");
  }

  /**
   * Set partition information.
   **/
  setPartitionInfo(partitionJsonText: string): void {
    throw new Error(`attempt to set partition info on non-partition type TemporalSchemaInfoInfo`);
  }

  applyTransformationsV2(model: Model, parsingErrors: ParsingError[]) {}

  applyTransformationsV3(model: Model, parsingErrors: ParsingError[]) {}

  checkRestrictionsV2(parsingErrors: ParsingError[]) {}

  checkRestrictionsV3(parsingErrors: ParsingError[]) {}

  trySetObjectProperty(propertyName: string, value: any, key: string | undefined): boolean {
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
    ancestorId: InDTMI,
    datatype: string,
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

  getCountOfExtendsNarrow(parsingErrors: ParsingError[]): number {
    throw new Error("Can not execute on an abstract class");
  }

  getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
    parsingErrors: ParsingError[]
  ): number {
    throw new Error("Can not execute on an abstract class");
  }
}

TemporalSchemaInfoImpl.initialize();
