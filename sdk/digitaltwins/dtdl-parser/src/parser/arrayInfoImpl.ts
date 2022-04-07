// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { ArrayInfo } from "./arrayInfo";
import { ArrayKinds } from "./arrayKinds";
import { LanguageStringType } from "./type";
import { SchemaInfoImpl } from "./schemaInfoImpl";
import { SchemaInfo } from "./schemaInfo";
import { EntityInfoImpl } from "./entityInfoImpl";
import { SupplementalTypeInfo } from "./supplementalTypeInfo";
import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { InDTMI } from "./internalDtmi";
import { ValueConstraint } from "./type";
import { Model } from "./model";
import { ParsingError } from "./parsingError";
import { createParsingError } from "./parsingErrorImpl";
import { Reference } from "../common/reference";
import { TraversalStatus } from "./enum";
export class ArrayInfoImpl implements ArrayInfo, TypeChecker {
  public dtdlVersion: number;
  public id: string;
  public childOf: string | undefined;
  public definedIn: string | undefined;
  public entityKind: ArrayKinds;
  public comment?: string;
  public description?: LanguageStringType;
  public displayName?: LanguageStringType;
  public elementSchema?: SchemaInfo;
  public _elementSchemaValueConstraints: ValueConstraint[] = [];
  private _elementSchemaInstanceProperties: string[] = [];
  public _elementSchemaAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _elementSchemaAllowedVersionsV3: Set<number> = new Set<number>().add(3).add(2);
  public languageVersion?: number;
  public parserClass: any;
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
    entityKind: ArrayKinds,
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
      .add("dtmi:dtdl:class:Array")
      .add("dtmi:dtdl:class:ComplexSchema")
      .add("dtmi:dtdl:class:Entity")
      .add("dtmi:dtdl:class:Schema");
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
      ArrayInfoImpl._versionlessTypes.has(new InDTMI(typeId).versionless) ||
      this.supplementalTypes.some((st) => (st as SupplementalTypeInfoImpl).doesHaveType(typeId))
    );
  }

  addConstraint(propertyName: string, valueConstraint: ValueConstraint): void {
    switch (propertyName) {
      case "elementSchema":
        if (this._elementSchemaValueConstraints === undefined) {
          this._elementSchemaValueConstraints = <ValueConstraint[]>[];
        }

        this._elementSchemaValueConstraints.push(valueConstraint);
        break;
    }
  }

  addInstanceProperty(propertyName: string, instancePropertyName: string): void {
    switch (propertyName) {
      case "elementSchema":
        if (this._elementSchemaInstanceProperties === undefined) {
          this._elementSchemaInstanceProperties = <string[]>[];
        }

        this._elementSchemaInstanceProperties.push(instancePropertyName);
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
    if (!Array.isArray(instanceElt)) {
      return false;
    }

    for (const child of instanceElt) {
      if (!(this.elementSchema as SchemaInfoImpl)?.validateInstanceInternal(child, undefined)) {
        return false;
      }
    }

    return true;
  }

  public validateInstanceV3(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceElt: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceName: string | undefined
  ): boolean {
    if (!Array.isArray(instanceElt)) {
      return false;
    }

    for (const child of instanceElt) {
      if (!(this.elementSchema as SchemaInfoImpl)?.validateInstanceInternal(child, undefined)) {
        return false;
      }
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
    throw new Error(`attempt to set partition info on non-partition type ArrayInfoInfo`);
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
    if (this._elementSchemaInstanceProperties !== undefined) {
      for (const instanceProp of this._elementSchemaInstanceProperties) {
        if (
          !(this.elementSchema as SchemaInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'elementSchema' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'elementSchema'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }

    const tooDeepElementSchemaOrSchemaElementId: Reference<InDTMI> = { ref: undefined };
    if (
      !this.checkDepthOfElementSchemaOrSchema(
        0,
        5,
        tooDeepElementSchemaOrSchemaElementId,
        parsingErrors
      ) &&
      tooDeepElementSchemaOrSchemaElementId !== undefined
    ) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:excessiveDepth", {
          cause: `{primaryId:n} is at the root of a hierarchy that exceeds 5 levels -- {secondaryId:n} is at level 6.`,
          action: `Change the value of one or more 'elementSchema' or 'schema' properties in the hierarchy to reduce the nesting depth.`,
          primaryId: this.id,
          secondaryId: tooDeepElementSchemaOrSchemaElementId.ref?.value
        })
      );
    }
  }

  checkRestrictionsV3(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void // eslint-disable-next-line @typescript-eslint/no-empty-function
  {
    if (this._elementSchemaInstanceProperties !== undefined) {
      for (const instanceProp of this._elementSchemaInstanceProperties) {
        if (
          !(this.elementSchema as SchemaInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'elementSchema' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'elementSchema'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }

    const tooDeepElementSchemaOrSchemaElementId: Reference<InDTMI> = { ref: undefined };
    if (
      !this.checkDepthOfElementSchemaOrSchema(
        0,
        5,
        tooDeepElementSchemaOrSchemaElementId,
        parsingErrors
      ) &&
      tooDeepElementSchemaOrSchemaElementId !== undefined
    ) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:excessiveDepth", {
          cause: `{primaryId:n} is at the root of a hierarchy that exceeds 5 levels -- {secondaryId:n} is at level 6.`,
          action: `Change the value of one or more 'elementSchema' or 'schema' properties in the hierarchy to reduce the nesting depth.`,
          primaryId: this.id,
          secondaryId: tooDeepElementSchemaOrSchemaElementId.ref?.value
        })
      );
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
      case "elementSchema":
      case "dtmi:dtdl:property:elementSchema;2":
      case "dtmi:dtdl:property:elementSchema;3":
        this.elementSchema = value as SchemaInfoImpl;
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
    if (this.elementSchema !== undefined) {
      if (depth === depthLimit) {
        tooDeepElementId.ref = InDTMI.createDtmi(this.id);
        return false;
      }
    }

    if (this.elementSchema !== undefined) {
      if (
        !(this.elementSchema as EntityInfoImpl).checkDepthOfElementSchemaOrSchema(
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

    if (this.elementSchema !== undefined) {
      (this.elementSchema as EntityInfoImpl).checkDescendantEnumValueDataType(
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

    if (this.elementSchema !== undefined) {
      if ((this.elementSchema as EntityInfoImpl).tryGetDescendantSchemaArray(elementId)) {
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
    if (this.elementSchema !== undefined) {
      this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue +=
        (this
          .elementSchema as EntityInfoImpl).getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
          parsingErrors
        ) + 1;
    }

    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.Complete;
    return this
      ._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue;
  }
}

ArrayInfoImpl.initialize();
