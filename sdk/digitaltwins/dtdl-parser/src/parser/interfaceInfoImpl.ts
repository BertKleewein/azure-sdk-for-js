// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { InterfaceInfo } from "./interfaceInfo";
import { InterfaceKinds } from "./interfaceKinds";
import { EntityKinds } from "./entityKinds";
import { Reference, referenceInit } from "../common/reference";
import { ContentInfo } from "./contentInfo";
import { LanguageStringType } from "./type";
import { ComplexSchemaInfoImpl } from "./complexSchemaInfoImpl";
import { ComplexSchemaInfo } from "./complexSchemaInfo";
import { SupplementalTypeInfo } from "./supplementalTypeInfo";
import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { ParsedObjectPropertyInfo } from "./parsedObjectPropertyInfo";
import { ElementPropertyConstraint } from "./type";
import { AggregateContext } from "./aggregateContext";
import { InDTMI } from "./internalDtmi";
import { ValueConstraint } from "./type";
import { Model } from "./model";
import { ParsingError } from "./parsingError";
import { EntityInfo } from "./entityInfo";
import { ContentInfoImpl } from "./contentInfoImpl";
import { createParsingError } from "./parsingErrorImpl";
import { TraversalStatus } from "./enum";
export class InterfaceInfoImpl implements InterfaceInfo, TypeChecker {
  public dtdlVersion: number;
  public id: string;
  public childOf: string | undefined;
  public definedIn: string | undefined;
  public entityKind: InterfaceKinds;
  public comment?: string;
  public contents?: { [value: string]: ContentInfo };
  public _contentsValueConstraints: ValueConstraint[] = [];
  private _contentsInstanceProperties: string[] = [];
  public _contentsAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _contentsAllowedVersionsV3: Set<number> = new Set<number>().add(3).add(2);
  public description?: LanguageStringType;
  public displayName?: LanguageStringType;
  public extends?: InterfaceInfo[];
  public _extendsValueConstraints: ValueConstraint[] = [];
  private _extendsInstanceProperties: string[] = [];
  public _extendsAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _extendsAllowedVersionsV3: Set<number> = new Set<number>().add(3).add(2);
  public languageVersion?: number;
  public schemas?: ComplexSchemaInfo[];
  public _schemasValueConstraints: ValueConstraint[] = [];
  private _schemasInstanceProperties: string[] = [];
  public _schemasAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _schemasAllowedVersionsV3: Set<number> = new Set<number>().add(3);
  public staticObjectClass: any;
  public supplementalTypeIds: string[];
  public supplementalProperties: { [x: string]: any };
  public supplementalTypes: SupplementalTypeInfo[];
  public undefinedTypes: string[];
  public undefinedProperties: { [name: string]: any };
  public sourceObject: any;
  public isPartition: boolean;
  private partitionJsonText: string | undefined;
  protected static _versionlessTypes: Set<string>;
  protected _checkedForDescendantSchemaOrContentsComponentNarrow: boolean;
  protected _idOfDescendantSchemaOrContentsComponentNarrow: InDTMI | undefined;
  protected _checkedDescendantEnumValueDatatype: string | undefined;
  protected _originalContents?: { [value: string]: ContentInfo };
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
    entityKind: InterfaceKinds,
    staticObjectClass: any
  ) {
    this.dtdlVersion = dtdlVersion;
    this.id = id;
    this.childOf = childOf;
    this.definedIn = definedIn;
    this.entityKind = entityKind;
    this.contents = {};
    this.description = {};
    this.displayName = {};
    this.extends = [];
    this.schemas = [];
    this.supplementalTypeIds = [];
    this.supplementalProperties = {};
    this.supplementalTypes = [];
    this.staticObjectClass = staticObjectClass;
    this.isPartition = true;
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

  static initialize() {
    this._versionlessTypes = new Set<string>()
      .add("dtmi:dtdl:class:Entity")
      .add("dtmi:dtdl:class:Interface");
  }

  public addType(dtmi: string, supplementalType: SupplementalTypeInfo | undefined): void {
    this.supplementalTypeIds.push(dtmi);
    if (supplementalType !== undefined) {
      this.supplementalTypes.push(supplementalType);
    }

    (supplementalType as SupplementalTypeInfoImpl).attachConstraints(this);
    (supplementalType as SupplementalTypeInfoImpl).bindInstanceProperties(this);
  }

  doesHaveType(typeId: string): boolean {
    return (
      InterfaceInfoImpl._versionlessTypes.has(new InDTMI(typeId).versionless) ||
      this.supplementalTypes.some((st) => (st as SupplementalTypeInfoImpl).doesHaveType(typeId))
    );
  }

  addConstraint(propertyName: string, valueConstraint: ValueConstraint): void {
    switch (propertyName) {
      case "contents":
        if (this._contentsValueConstraints === undefined) {
          this._contentsValueConstraints = <ValueConstraint[]>[];
        }

        this._contentsValueConstraints.push(valueConstraint);
        break;
      case "extends":
        if (this._extendsValueConstraints === undefined) {
          this._extendsValueConstraints = <ValueConstraint[]>[];
        }

        this._extendsValueConstraints.push(valueConstraint);
        break;
      case "schemas":
        if (this._schemasValueConstraints === undefined) {
          this._schemasValueConstraints = <ValueConstraint[]>[];
        }

        this._schemasValueConstraints.push(valueConstraint);
        break;
    }
  }

  addInstanceProperty(propertyName: string, instancePropertyName: string): void {
    switch (propertyName) {
      case "contents":
        if (this._contentsInstanceProperties === undefined) {
          this._contentsInstanceProperties = <string[]>[];
        }

        this._contentsInstanceProperties.push(instancePropertyName);
        break;
      case "extends":
        if (this._extendsInstanceProperties === undefined) {
          this._extendsInstanceProperties = <string[]>[];
        }

        this._extendsInstanceProperties.push(instancePropertyName);
        break;
      case "schemas":
        if (this._schemasInstanceProperties === undefined) {
          this._schemasInstanceProperties = <string[]>[];
        }

        this._schemasInstanceProperties.push(instancePropertyName);
        break;
    }
  }

  doesPropertyDictContainKey(propertyName: string, key: string | undefined): boolean {
    switch (propertyName) {
      case "contents":
        if (key !== undefined && Object.prototype.hasOwnProperty.call(this.contents, key)) {
          return true;
        } else {
          return false;
        }

      default:
        return false;
    }
  }

  public validateInstance(instanceText: string): boolean {
    const instanceElt = JSON.parse(instanceText);
    return this.validateInstanceElement(instanceElt);
  }

  public validateInstanceElement(instanceElt: unknown): boolean {
    return false;
  }

  public validateInstanceInternal(instanceElt: unknown, instanceName: string | undefined): boolean {
    return false;
  }

  public validateInstanceV2(instanceElt: unknown, instanceName: string | undefined): boolean {
    return false;
  }

  public validateInstanceV3(instanceElt: unknown, instanceName: string | undefined): boolean {
    return false;
  }

  /**
   * Set partition information.
   **/
  setPartitionInfo(partitionJsonText: string): void {
    this.partitionJsonText = partitionJsonText;
  }

  /**
   * Gets a JSON string that holds the portion of the DTDL model that defines this InterfaceInfo.
   **/
  getJsonLdText(): string {
    return this.partitionJsonText || "";
  }

  /**
   * Gets a JsonElement that holds the portion of the DTDL model that defines this InterfaceInfo.
   **/
  getJsonLd(): any {
    return JSON.parse(this.partitionJsonText || "");
  }

  applyTransformations(model: Model, parsingErrors: ParsingError[]): void {
    if (this.dtdlVersion === 2) {
      this.applyTransformationsV2(model, parsingErrors);
    }

    if (this.dtdlVersion === 3) {
      this.applyTransformationsV3(model, parsingErrors);
    }
  }

  applyTransformationsV2(model: Model, parsingErrors: ParsingError[]) {
    if (this._originalContents === undefined) {
      this._originalContents = { ...this.contents };
    }

    const tooDeepElementId: Reference<InDTMI> = { ref: undefined };
    const sources = this.getTransitiveExtendsNarrow(0, 10, tooDeepElementId, parsingErrors);

    if (sources !== undefined) {
      sources.forEach((dtmi) => {
        (model.dict[dtmi] as InterfaceInfoImpl).importContents(
          new InDTMI(this.id),
          `'extends'`,
          this.contents || {},
          parsingErrors
        );
      });
    } else if (tooDeepElementId.ref !== undefined) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:excessiveDepth", {
          cause: `{primaryId:n} is at the root of a chain of 'extends' properties that exceeds 10 levels -- {secondaryId:n} is at level 11.`,
          action: `Change the value of one or more 'extends' properties in the hierarchy to reduce the nesting depth.`,
          primaryId: this.id,
          secondaryId: tooDeepElementId.ref.value
        })
      );
    }
  }

  applyTransformationsV3(model: Model, parsingErrors: ParsingError[]) {
    if (this._originalContents === undefined) {
      this._originalContents = { ...this.contents };
    }

    const tooDeepElementId: Reference<InDTMI> = { ref: undefined };
    const sources = this.getTransitiveExtendsNarrow(0, 10, tooDeepElementId, parsingErrors);

    if (sources !== undefined) {
      sources.forEach((dtmi) => {
        (model.dict[dtmi] as InterfaceInfoImpl).importContents(
          new InDTMI(this.id),
          `'extends'`,
          this.contents || {},
          parsingErrors
        );
      });
    } else if (tooDeepElementId.ref !== undefined) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:excessiveDepth", {
          cause: `{primaryId:n} is at the root of a chain of 'extends' properties that exceeds 10 levels -- {secondaryId:n} is at level 11.`,
          action: `Change the value of one or more 'extends' properties in the hierarchy to reduce the nesting depth.`,
          primaryId: this.id,
          secondaryId: tooDeepElementId.ref.value
        })
      );
    }
  }

  checkRestrictions(parsingErrors: ParsingError[]): void {
    if (this.dtdlVersion === 2) {
      this.checkRestrictionsV2(parsingErrors);
    }

    if (this.dtdlVersion === 3) {
      this.checkRestrictionsV3(parsingErrors);
    }
  }

  checkRestrictionsV2(parsingErrors: ParsingError[]) {}

  checkRestrictionsV3(parsingErrors: ParsingError[]) {
    const numExtendsNarrowValues: number = this.getCountOfExtendsNarrow(parsingErrors);
    if (numExtendsNarrowValues > 1024) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:excessiveCount", {
          cause: `{primaryId:n} is at the root of a hierarchy that contains ${numExtendsNarrowValues} 'extends' properties, but the allowed maximum count is 1024.`,
          action: `Remove one or more 'extends' property values to reduce the total count.`,
          primaryId: this.id
        })
      );
    }

    const numContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValues: number = this.getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
      parsingErrors
    );
    if (
      numContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValues >
      100000
    ) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:excessiveCount", {
          cause: `{primaryId:n} is at the root of a hierarchy that contains ${numContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValues} 'contents' or 'fields' or 'enumValues' or 'request' or 'response' or 'properties' or 'schema' or 'elementSchema' or 'mapValue' properties, but the allowed maximum count is 100000.`,
          action: `Remove one or more 'contents' or 'fields' or 'enumValues' or 'request' or 'response' or 'properties' or 'schema' or 'elementSchema' or 'mapValue' property values to reduce the total count.`,
          primaryId: this.id
        })
      );
    }
  }

  trySetObjectProperty(propertyName: string, value: any, key: string | undefined): boolean {
    switch (propertyName) {
      case "contents":
      case "dtmi:dtdl:property:contents;2":
      case "dtmi:dtdl:property:contents;3":
        if (key !== undefined && this.contents !== undefined) {
          this.contents[key] = value as ContentInfoImpl;
          return true;
        }

        break;
      case "extends":
      case "dtmi:dtdl:property:extends;2":
      case "dtmi:dtdl:property:extends;3":
        if (this.extends !== undefined) {
          this.extends.push(value as InterfaceInfoImpl);
          return true;
        }

        break;
      case "schemas":
      case "dtmi:dtdl:property:schemas;2":
      case "dtmi:dtdl:property:schemas;3":
        if (this.schemas !== undefined) {
          this.schemas.push(value as ComplexSchemaInfoImpl);
          return true;
        }

        break;
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
    parsingErrors: ParsingError[]
  ): boolean {
    for (const item of Object.values(this.contents || {})) {
      if (
        !(item as ContentInfoImpl).checkDepthOfElementSchemaOrSchema(
          depth,
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

    for (const item of this.extends || []) {
      if (
        !(item as InterfaceInfoImpl).checkDepthOfElementSchemaOrSchema(
          depth,
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

    for (const item of this.schemas || []) {
      if (
        !(item as ComplexSchemaInfoImpl).checkDepthOfElementSchemaOrSchema(
          depth,
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

    for (const item of Object.values(this.contents || {})) {
      if ((item as ContentInfoImpl).entityKind === "component") {
        elementId.ref = new InDTMI((item as ContentInfoImpl).id);
        this._idOfDescendantSchemaOrContentsComponentNarrow = elementId.ref;
        return true;
      }

      if ((item as ContentInfoImpl).tryGetDescendantSchemaOrContentsComponentNarrow(elementId)) {
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

    for (const item of Object.values(this.contents || {})) {
      (item as ContentInfoImpl).checkDescendantEnumValueDataType(
        ancestorId,
        datatype,
        parsingErrors
      );
    }

    for (const item of this.extends || []) {
      (item as InterfaceInfoImpl).checkDescendantEnumValueDataType(
        ancestorId,
        datatype,
        parsingErrors
      );
    }

    for (const item of this.schemas || []) {
      (item as ComplexSchemaInfoImpl).checkDescendantEnumValueDataType(
        ancestorId,
        datatype,
        parsingErrors
      );
    }
  }

  getTransitiveExtendsNarrow(
    depth: number,
    depthLimit: number,
    tooDeepElementId: Reference<InDTMI>,
    parsingErrors: ParsingError[]
  ): Set<string> | undefined {
    if (this.extends !== undefined && this.extends.length !== 0) {
      if (depth === depthLimit) {
        tooDeepElementId.ref = new InDTMI(this.id);
        return undefined;
      }
    }

    const closure: Set<string> = new Set<string>();

    for (const item of this.extends || []) {
      const others:
        | Set<string>
        | undefined = (item as InterfaceInfoImpl).getTransitiveExtendsNarrow(
        depth + 1,
        depthLimit,
        tooDeepElementId,
        parsingErrors
      );
      if (others !== undefined) {
        closure.add((item as InterfaceInfoImpl).id);
        others.forEach((item) => closure.add(item));
      } else {
        if (tooDeepElementId.ref?.value === this.id) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:recursiveStructure", {
              cause: `{primaryId:n} is at the root of a chain of 'extends' properties that includes itself.`,
              action: `Change the value of one or more 'extends' properties in the hierarchy to remeve the recursion.`,
              primaryId: this.id
            })
          );
          tooDeepElementId.ref = undefined;
        }

        return undefined;
      }
    }

    tooDeepElementId.ref = undefined;
    return closure;
  }

  /**
   * Copy the values of this object's Contents property into contents`.
   **/
  importContents(
    ancestorId: InDTMI,
    importPropertyName: string,
    contents: { [value: string]: ContentInfo },
    parsingErrors: ParsingError[]
  ): void {
    const currentObject = this._originalContents || this.contents || {};
    for (const [key, value] of Object.entries(currentObject)) {
      if (Object.prototype.hasOwnProperty.call(contents, key)) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:nonUniqueImportedPropertyValue", {
            cause: `{primaryId:n}, because it transitively ${importPropertyName} {secondaryId}, has property 'contents' that contains more than one element whose property 'name' has value '${key}'.`,
            action: `Either change the value of property 'name' to a unique string value, or remove one or more ${importPropertyName} properties so that 'contents' will not be imported.`,
            primaryId: ancestorId.value,
            secondaryId: this.id,
            property: `contents`,
            value: `name`
          })
        );
      } else {
        contents[key] = value;
      }
    }
  }

  tryGetDescendantSchemaArray(elementId: Reference<InDTMI>): boolean {
    if (this._checkedForDescendantSchemaArray) {
      elementId.ref = this._idOfDescendantSchemaArray;
      return this._idOfDescendantSchemaArray !== undefined;
    }

    this._checkedForDescendantSchemaArray = true;

    for (const item of Object.values(this.contents || {})) {
      if ((item as ContentInfoImpl).tryGetDescendantSchemaArray(elementId)) {
        this._idOfDescendantSchemaArray = elementId.ref;
        return true;
      }
    }

    for (const item of this.extends || []) {
      if ((item as InterfaceInfoImpl).tryGetDescendantSchemaArray(elementId)) {
        this._idOfDescendantSchemaArray = elementId.ref;
        return true;
      }
    }

    for (const item of this.schemas || []) {
      if ((item as ComplexSchemaInfoImpl).tryGetDescendantSchemaArray(elementId)) {
        this._idOfDescendantSchemaArray = elementId.ref;
        return true;
      }
    }

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
    for (const item of this.extends || []) {
      this._countOfExtendsNarrowValue +=
        (item as InterfaceInfoImpl).getCountOfExtendsNarrow(parsingErrors) + 1;
    }

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
    for (const item of Object.values(this.contents || {})) {
      this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue +=
        (item as ContentInfoImpl).getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
          parsingErrors
        ) + 1;
    }

    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.Complete;
    return this
      ._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue;
  }
}

InterfaceInfoImpl.initialize();
