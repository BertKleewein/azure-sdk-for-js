// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { EnumInfo } from "./enumInfo";
import { EnumKinds } from "./enumKinds";
import { LanguageStringType } from "./type";
import { EnumValueInfoImpl } from "./enumValueInfoImpl";
import { EnumValueInfo } from "./enumValueInfo";
import { PrimitiveSchemaInfoImpl } from "./primitiveSchemaInfoImpl";
import { PrimitiveSchemaInfo } from "./primitiveSchemaInfo";
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
import { AggregateContext } from "./aggregateContext";
import { Reference } from "../common/reference";
import { TraversalStatus } from "./enum";
export class EnumInfoImpl implements EnumInfo, TypeChecker {
  public dtdlVersion: number;
  public id: string;
  public childOf: string | undefined;
  public definedIn: string | undefined;
  public entityKind: EnumKinds;
  public comment?: string;
  public description?: LanguageStringType;
  public displayName?: LanguageStringType;
  public enumValues?: EnumValueInfo[];
  public _enumValuesValueConstraints: ValueConstraint[] = [];
  private _enumValuesInstanceProperties: string[] = [];
  public _enumValuesAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _enumValuesAllowedVersionsV3: Set<number> = new Set<number>().add(3);
  public languageVersion?: number;
  public valueSchema?: PrimitiveSchemaInfo;
  public _valueSchemaValueConstraints: ValueConstraint[] = [];
  private _valueSchemaInstanceProperties: string[] = [];
  public _valueSchemaAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _valueSchemaAllowedVersionsV3: Set<number> = new Set<number>().add(3);
  public parserClass: Parser = ParserCollection.EnumInfoParser;
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
    entityKind: EnumKinds
  ) {
    this.dtdlVersion = dtdlVersion;
    this.id = id;
    this.childOf = childOf;
    this.definedIn = definedIn;
    this.entityKind = entityKind;
    this.description = {};
    this.displayName = {};
    this.enumValues = [];
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
      .add("dtmi:dtdl:class:ComplexSchema")
      .add("dtmi:dtdl:class:Entity")
      .add("dtmi:dtdl:class:Enum")
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
      EnumInfoImpl._versionlessTypes.has(new InDTMI(typeId).versionless) ||
      this.supplementalTypes.some((st) => (st as SupplementalTypeInfoImpl).doesHaveType(typeId))
    );
  }

  addConstraint(propertyName: string, valueConstraint: ValueConstraint): void {
    switch (propertyName) {
      case "enumValues":
        if (this._enumValuesValueConstraints === undefined) {
          this._enumValuesValueConstraints = <ValueConstraint[]>[];
        }

        this._enumValuesValueConstraints.push(valueConstraint);
        break;
      case "valueSchema":
        if (this._valueSchemaValueConstraints === undefined) {
          this._valueSchemaValueConstraints = <ValueConstraint[]>[];
        }

        this._valueSchemaValueConstraints.push(valueConstraint);
        break;
    }
  }

  addInstanceProperty(propertyName: string, instancePropertyName: string): void {
    switch (propertyName) {
      case "enumValues":
        if (this._enumValuesInstanceProperties === undefined) {
          this._enumValuesInstanceProperties = <string[]>[];
        }

        this._enumValuesInstanceProperties.push(instancePropertyName);
        break;
      case "valueSchema":
        if (this._valueSchemaInstanceProperties === undefined) {
          this._valueSchemaInstanceProperties = <string[]>[];
        }

        this._valueSchemaInstanceProperties.push(instancePropertyName);
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
    if (
      !(this.valueSchema as PrimitiveSchemaInfoImpl)?.validateInstanceInternal(
        instanceElt,
        instanceName
      )
    ) {
      return false;
    }

    if (
      !this.enumValues?.some((val) =>
        (val as EnumValueInfoImpl).validateInstanceInternal(instanceElt, instanceName)
      )
    ) {
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
    if (
      !(this.valueSchema as PrimitiveSchemaInfoImpl)?.validateInstanceInternal(
        instanceElt,
        instanceName
      )
    ) {
      return false;
    }

    if (
      !this.enumValues?.some((val) =>
        (val as EnumValueInfoImpl).validateInstanceInternal(instanceElt, instanceName)
      )
    ) {
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
    throw new Error(`attempt to set partition info on non-partition type EnumInfoInfo`);
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
    const enumValuesNameSet = new Set<any>();
    if (this.enumValues !== undefined) {
      for (const item of this.enumValues || []) {
        if (enumValuesNameSet.has(item.name)) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonUniquePropertyValue", {
              cause:
                "{{primaryId:n}} property 'enumValues' contains more than one element whose property 'name' has value '{item.name}'.",
              action:
                "Change the value of property  'name' to a string value that is unique across all values of 'enumValues'.",
              primaryId: this.id,
              property: "enumValues",
              value: "name"
            })
          );
        }

        enumValuesNameSet.add(item.name);
      }
    }

    const enumValuesEnumValueSet = new Set<any>();
    if (this.enumValues !== undefined) {
      for (const item of this.enumValues || []) {
        if (enumValuesEnumValueSet.has(item.enumValue)) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonUniquePropertyValue", {
              cause:
                "{{primaryId:n}} property 'enumValues' contains more than one element whose property 'enumValue' has value '{item.enumValue}'.",
              action:
                "Change the value of property  'enumValue' to a string value that is unique across all values of 'enumValues'.",
              primaryId: this.id,
              property: "enumValues",
              value: "enumValue"
            })
          );
        }

        enumValuesEnumValueSet.add(item.enumValue);
      }
    }

    if (this.valueSchema !== undefined) {
      if (
        this.valueSchema.id !== "dtmi:dtdl:instance:Schema:integer;2" &&
        this.valueSchema.id !== "dtmi:dtdl:instance:Schema:string;2"
      ) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:incorrectPropertyValue", {
            cause:
              "{{primaryId:n}} property 'valueSchema' has value {value} , but the value must be 'integer or string'.",
            action: "Change the value of property  'valueSchema' to 'integer or string'.",
            primaryId: this.id,
            property: "valueSchema",
            value: AggregateContext.getTermOrUri(this.valueSchema.id)
          })
        );
      }
    }

    if (this._valueSchemaInstanceProperties !== undefined) {
      for (const instanceProp of this._valueSchemaInstanceProperties) {
        if (
          !(this.valueSchema as PrimitiveSchemaInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'valueSchema' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'valueSchema'",
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

    const myUri: string = this.valueSchema?.id || "";
    if (myUri === "dtmi:dtdl:instance:Schema:integer;2") {
      this.checkDescendantEnumValueDataType(new InDTMI(this.id), "number", parsingErrors);
    }

    if (myUri === "dtmi:dtdl:instance:Schema:string;2") {
      this.checkDescendantEnumValueDataType(new InDTMI(this.id), "string", parsingErrors);
    }

    if (myUri === "dtmi:dtdl:instance:Schema:boolean;2") {
      this.checkDescendantEnumValueDataType(new InDTMI(this.id), "boolean", parsingErrors);
    }
  }

  checkRestrictionsV3(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsingErrors: ParsingError[]
  ): void // eslint-disable-next-line @typescript-eslint/no-empty-function
  {
    const enumValuesNameSet = new Set<any>();
    if (this.enumValues !== undefined) {
      for (const item of this.enumValues || []) {
        if (enumValuesNameSet.has(item.name)) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonUniquePropertyValue", {
              cause:
                "{{primaryId:n}} property 'enumValues' contains more than one element whose property 'name' has value '{item.name}'.",
              action:
                "Change the value of property  'name' to a string value that is unique across all values of 'enumValues'.",
              primaryId: this.id,
              property: "enumValues",
              value: "name"
            })
          );
        }

        enumValuesNameSet.add(item.name);
      }
    }

    const enumValuesEnumValueSet = new Set<any>();
    if (this.enumValues !== undefined) {
      for (const item of this.enumValues || []) {
        if (enumValuesEnumValueSet.has(item.enumValue)) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonUniquePropertyValue", {
              cause:
                "{{primaryId:n}} property 'enumValues' contains more than one element whose property 'enumValue' has value '{item.enumValue}'.",
              action:
                "Change the value of property  'enumValue' to a string value that is unique across all values of 'enumValues'.",
              primaryId: this.id,
              property: "enumValues",
              value: "enumValue"
            })
          );
        }

        enumValuesEnumValueSet.add(item.enumValue);
      }
    }

    if (this.valueSchema !== undefined) {
      if (
        this.valueSchema.id !== "dtmi:dtdl:instance:Schema:integer;3" &&
        this.valueSchema.id !== "dtmi:dtdl:instance:Schema:string;3"
      ) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:incorrectPropertyValue", {
            cause:
              "{{primaryId:n}} property 'valueSchema' has value {value} , but the value must be 'integer or string'.",
            action: "Change the value of property  'valueSchema' to 'integer or string'.",
            primaryId: this.id,
            property: "valueSchema",
            value: AggregateContext.getTermOrUri(this.valueSchema.id)
          })
        );
      }
    }

    if (this._valueSchemaInstanceProperties !== undefined) {
      for (const instanceProp of this._valueSchemaInstanceProperties) {
        if (
          !(this.valueSchema as PrimitiveSchemaInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'valueSchema' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'valueSchema'",
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

    const myUri: string = this.valueSchema?.id || "";
    if (myUri === "dtmi:dtdl:instance:Schema:integer;3") {
      this.checkDescendantEnumValueDataType(new InDTMI(this.id), "number", parsingErrors);
    }

    if (myUri === "dtmi:dtdl:instance:Schema:string;3") {
      this.checkDescendantEnumValueDataType(new InDTMI(this.id), "string", parsingErrors);
    }

    if (myUri === "dtmi:dtdl:instance:Schema:boolean;3") {
      this.checkDescendantEnumValueDataType(new InDTMI(this.id), "boolean", parsingErrors);
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
      case "enumValues":
      case "dtmi:dtdl:property:enumValues;2":
      case "dtmi:dtdl:property:enumValues;3":
        if (this.enumValues !== undefined) {
          this.enumValues.push(value as EnumValueInfoImpl);
          return true;
        }

        break;
      case "valueSchema":
      case "dtmi:dtdl:property:valueSchema;2":
      case "dtmi:dtdl:property:valueSchema;3":
        this.valueSchema = value as PrimitiveSchemaInfoImpl;
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
    for (const item of this.enumValues || []) {
      if (
        !(item as EnumValueInfoImpl).checkDepthOfElementSchemaOrSchema(
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

    if (this.valueSchema !== undefined) {
      if (
        !(this.valueSchema as EntityInfoImpl).checkDepthOfElementSchemaOrSchema(
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

    for (const item of this.enumValues || []) {
      (item as EnumValueInfoImpl).checkDescendantEnumValueDataType(
        ancestorId,
        datatype,
        parsingErrors
      );
    }

    if (this.valueSchema !== undefined) {
      (this.valueSchema as EntityInfoImpl).checkDescendantEnumValueDataType(
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

    for (const item of this.enumValues || []) {
      if ((item as EnumValueInfoImpl).tryGetDescendantSchemaArray(elementId)) {
        this._idOfDescendantSchemaArray = elementId.ref;
        return true;
      }
    }

    if (this.valueSchema !== undefined) {
      if ((this.valueSchema as EntityInfoImpl).tryGetDescendantSchemaArray(elementId)) {
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
    for (const item of this.enumValues || []) {
      this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue +=
        (item as EnumValueInfoImpl).getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
          parsingErrors
        ) + 1;
    }

    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.Complete;
    return this
      ._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue;
  }
}
