// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { PropertyInfo } from "./propertyInfo";
import { PropertyKinds } from "./propertyKinds";
import { LanguageStringType } from "./type";
import { SchemaInfoImpl } from "./schemaInfoImpl";
import { SchemaInfo } from "./schemaInfo";
import { EntityInfoImpl } from "./entityInfoImpl";
import { Parser } from "./parser";
import { ParserCollection } from "./parserCollection";
import { SupplementalTypeInfo } from "./supplementalTypeInfo";
import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { InDTMI } from "./internalDtmi";
import { ValueConstraint } from "./type";
import { Model } from "./model";
import { ParsingError } from "./parsingError";
import { createParsingError } from "./parsingErrorImpl";
import { Reference } from "../common/reference";
import { TraversalStatus } from "./enum";
export class PropertyInfoImpl implements PropertyInfo, TypeChecker {
  public dtdlVersion: number;
  public id: string;
  public childOf: string | undefined;
  public definedIn: string | undefined;
  public entityKind: PropertyKinds;
  public comment?: string;
  public description?: LanguageStringType;
  public displayName?: LanguageStringType;
  public languageVersion?: number;
  public name?: string;
  public namePropertyRegexPatternV2: RegExp = /^[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?$/;
  public namePropertyRegexPatternV3: RegExp = /^[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?$/;
  public schema?: SchemaInfo;
  public _schemaValueConstraints: ValueConstraint[] = [];
  private _schemaInstanceProperties: string[] = [];
  public _schemaAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _schemaAllowedVersionsV3: Set<number> = new Set<number>().add(3).add(2);
  public writable?: boolean;
  public parserClass: Parser = ParserCollection.PropertyInfoParser;
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
  protected _countOfExtendsNarrowStatus: TraversalStatus;
  protected _countOfExtendsNarrowValue: number;
  protected _countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus: TraversalStatus;
  protected _countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue: number;

  constructor(
    dtdlVersion: number,
    id: string,
    childOf: string | undefined,
    definedIn: string | undefined,
    entityKind: PropertyKinds
  ) {
    this.dtdlVersion = dtdlVersion;
    this.id = id;
    this.childOf = childOf;
    this.definedIn = definedIn;
    this.entityKind = entityKind;
    this.description = {};
    this.displayName = {};
    this.writable = false;
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
    this._countOfExtendsNarrowStatus = TraversalStatus.NotStarted;
    this._countOfExtendsNarrowValue = 0;
    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.NotStarted;
    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue = 0;
  }

  public static initialize(): void {
    this._versionlessTypes = new Set<string>()
      .add("dtmi:dtdl:class:Content")
      .add("dtmi:dtdl:class:Entity")
      .add("dtmi:dtdl:class:NamedEntity")
      .add("dtmi:dtdl:class:Property");
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

    (supplementalType as SupplementalTypeInfoImpl).attachConstraints(this);
    (supplementalType as SupplementalTypeInfoImpl).bindInstanceProperties(this);
  }

  doesHaveType(typeId: string): boolean {
    return (
      PropertyInfoImpl._versionlessTypes.has(new InDTMI(typeId).versionless) ||
      this.supplementalTypes.some((st) => (st as SupplementalTypeInfoImpl).doesHaveType(typeId))
    );
  }

  addConstraint(propertyName: string, valueConstraint: ValueConstraint): void {
    switch (propertyName) {
      case "schema":
        if (this._schemaValueConstraints === undefined) {
          this._schemaValueConstraints = <ValueConstraint[]>[];
        }

        this._schemaValueConstraints.push(valueConstraint);
        break;
    }
  }

  addInstanceProperty(propertyName: string, instancePropertyName: string): void {
    switch (propertyName) {
      case "schema":
        if (this._schemaInstanceProperties === undefined) {
          this._schemaInstanceProperties = <string[]>[];
        }

        this._schemaInstanceProperties.push(instancePropertyName);
        break;
    }
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
    return false;
  }

  public validateInstanceInternal(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    return false;
  }

  public validateInstanceV2(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    return false;
  }

  public validateInstanceV3(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    return false;
  }

  /**
   * Set partition information.
   **/
  setPartitionInfo(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    partitionJsonText: string
  ): void {
    throw new Error(`attempt to set partition info on non-partition type PropertyInfoInfo`);
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
  {
    if (this._schemaInstanceProperties !== undefined) {
      for (const instanceProp of this._schemaInstanceProperties) {
        if (
          !(this.schema as SchemaInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'schema' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'schema'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }

    const excludedArrayElementId: Reference<InDTMI> = { ref: undefined };
    this.tryGetDescendantSchemaArray(excludedArrayElementId);
    if (excludedArrayElementId.ref !== undefined) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:excludedType", {
          cause: `{primaryId:n} contains Array{secondaryId:e}, which is not allowed in 'schema' properties under elements of type {typeName}.`,
          action: `Remove the elements of type Array from 'schema' properties under the element of type Property.`,
          primaryId: this.id,
          secondaryId: excludedArrayElementId.ref.value
        })
      );
    }
  }

  checkRestrictionsV3(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void // eslint-disable-next-line @typescript-eslint/no-empty-function
  {
    if (this._schemaInstanceProperties !== undefined) {
      for (const instanceProp of this._schemaInstanceProperties) {
        if (
          !(this.schema as SchemaInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'schema' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'schema'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }
  }

  trySetObjectProperty(
    propertyName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
    value: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key: string | undefined
  ): boolean {
    switch (propertyName) {
      case "schema":
      case "dtmi:dtdl:property:schema;2":
      case "dtmi:dtdl:property:schema;3":
        this.schema = value as SchemaInfoImpl;
        return true;
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
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    ancestorId: InDTMI,
    datatype: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (this.schema !== undefined) {
      this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue +=
        (this
          .schema as EntityInfoImpl).getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
          parsingErrors
        ) + 1;
    }

    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.Complete;
    return this
      ._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue;
  }
}
