// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { SchemaFieldInfo } from "./schemaFieldInfo";
import { SchemaFieldKinds } from "./schemaFieldKinds";
import { EntityKinds } from "./entityKinds";
import { SchemaFieldInfoStatic } from "./schemaFieldInfoStatic";
import { Reference, referenceInit } from "../common/reference";
import { LanguageStringType } from "./type";
import { SchemaInfoImpl } from "./schemaInfoImpl";
import { SchemaInfo } from "./schemaInfo";
import { EntityInfoImpl } from "./entityInfoImpl";
import { SupplementalTypeInfo } from "./supplementalTypeInfo";
import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { InDTMI } from "./internalDtmi";
import { Model } from "./model";
import { ParsingError } from "./parsingError";
import { EntityInfo } from "./entityInfo";
import { createParsingError } from "./parsingErrorImpl";
export abstract class SchemaFieldInfoImpl implements SchemaFieldInfo, TypeChecker {
  public staticObject: any = SchemaFieldInfoStatic;
  public dtdlVersion: number;
  public id: string;
  public childOf: string | undefined;
  public definedIn: string | undefined;
  public entityKind: SchemaFieldKinds;
  public comment?: string;
  public description?: LanguageStringType;
  public displayName?: LanguageStringType;
  public languageVersion?: number;
  public name?: string;
  public namePropertyRegexPatternV2: RegExp = /^[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?$/;
  public namePropertyRegexPatternV3: RegExp = /^[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?$/;
  public schema?: SchemaInfo;
  public _schemaAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _schemaAllowedVersionsV3: Set<number> = new Set<number>().add(3).add(2);
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
    entityKind: SchemaFieldKinds
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

  static initialize() {
    this._versionlessTypes = new Set<string>()
      .add("dtmi:dtdl:class:Entity")
      .add("dtmi:dtdl:class:NamedEntity")
      .add("dtmi:dtdl:class:SchemaField");
  }

  public addType(dtmi: string, supplementalType: SupplementalTypeInfo | undefined): void {
    throw new Error("Attempt to add type to non augmentable type SchemaFieldInfo");
  }

  doesHaveType(typeId: string): boolean {
    return SchemaFieldInfoImpl._versionlessTypes.has(new InDTMI(typeId).versionless);
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
    throw new Error(`attempt to set partition info on non-partition type SchemaFieldInfoInfo`);
  }

  applyTransformationsV2(model: Model, parsingErrors: ParsingError[]) {}

  applyTransformationsV3(model: Model, parsingErrors: ParsingError[]) {}

  checkRestrictionsV2(parsingErrors: ParsingError[]) {}

  checkRestrictionsV3(parsingErrors: ParsingError[]) {}

  trySetObjectProperty(propertyName: string, value: any, key: string | undefined): boolean {
    switch (propertyName) {
      case "schema":
      case "dtmi:dtdl:property:schema;2":
      case "dtmi:dtdl:property:schema;3":
        this.schema = value as SchemaInfoImpl;
        return true;
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
    if (this.schema !== undefined) {
      if (depth === depthLimit) {
        tooDeepElementId.ref = InDTMI.createDtmi(this.id);
        return false;
      }
    }

    if (this.schema !== undefined) {
      if (
        !(this.schema as EntityInfoImpl).checkDepthOfElementSchemaOrSchema(
          depth + 1,
          depthLimit,
          tooDeepElementId,
          parsingErrors
        )
      ) {
        if (tooDeepElementId.ref?.value === this.id) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:recursiveStructure", {
              cause: `{primaryId:n} is at the root of a hierarchy that includes itself.`,
              action: `Change the value of one or more 'elementSchema' or 'schema' properties in the hierarchy to remeve the recursion.`,
              primaryId: this.id
            })
          );
          tooDeepElementId.ref = undefined;
        }

        return false;
      }
    }

    tooDeepElementId.ref = undefined;
    return true;
  }

  tryGetDescendantSchemaOrContentsComponentNarrow(elementId: Reference<InDTMI>): boolean {
    if (this._checkedForDescendantSchemaOrContentsComponentNarrow) {
      elementId.ref = this._idOfDescendantSchemaOrContentsComponentNarrow;
      return this._idOfDescendantSchemaOrContentsComponentNarrow !== undefined;
    }

    this._checkedForDescendantSchemaOrContentsComponentNarrow = true;

    if (this.schema !== undefined) {
      if ((this.schema as EntityInfoImpl).entityKind === "component") {
        elementId.ref = new InDTMI((this.schema as EntityInfoImpl).id);
        this._idOfDescendantSchemaOrContentsComponentNarrow = elementId.ref;
        return true;
      }

      if (
        (this.schema as EntityInfoImpl).tryGetDescendantSchemaOrContentsComponentNarrow(elementId)
      ) {
        this._idOfDescendantSchemaOrContentsComponentNarrow = elementId.ref;
        return true;
      }
    }

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

    if (this.schema !== undefined) {
      (this.schema as EntityInfoImpl).checkDescendantEnumValueDataType(
        ancestorId,
        datatype,
        parsingErrors
      );
    }
  }

  tryGetDescendantSchemaArray(elementId: Reference<InDTMI>): boolean {
    if (this._checkedForDescendantSchemaArray) {
      elementId.ref = this._idOfDescendantSchemaArray;
      return this._idOfDescendantSchemaArray !== undefined;
    }

    this._checkedForDescendantSchemaArray = true;

    if (this.schema !== undefined) {
      if ((this.schema as EntityInfoImpl).entityKind === "array") {
        elementId.ref = new InDTMI((this.schema as EntityInfoImpl).id);
        this._idOfDescendantSchemaArray = elementId.ref;
        return true;
      }

      if ((this.schema as EntityInfoImpl).tryGetDescendantSchemaArray(elementId)) {
        this._idOfDescendantSchemaArray = elementId.ref;
        return true;
      }
    }

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

SchemaFieldInfoImpl.initialize();
