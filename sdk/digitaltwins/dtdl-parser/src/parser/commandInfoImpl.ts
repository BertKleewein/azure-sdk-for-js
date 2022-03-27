// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { CommandInfo } from "./commandInfo";
import { CommandKinds } from "./commandKinds";
import { EntityKinds } from "./entityKinds";
import { CommandInfoStatic } from "./commandInfoStatic";
import { Reference, referenceInit } from "../common/reference";
import { CommandTypeInfoImpl } from "./commandTypeInfoImpl";
import { CommandTypeInfo } from "./commandTypeInfo";
import { EntityInfoImpl } from "./entityInfoImpl";
import { LanguageStringType } from "./type";
import { CommandPayloadInfoImpl } from "./commandPayloadInfoImpl";
import { CommandPayloadInfo } from "./commandPayloadInfo";
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
import { createParsingError } from "./parsingErrorImpl";
import { TraversalStatus } from "./enum";
export class CommandInfoImpl implements CommandInfo, TypeChecker {
  public dtdlVersion: number;
  public id: string;
  public childOf: string | undefined;
  public definedIn: string | undefined;
  public entityKind: CommandKinds;
  public commandType?: CommandTypeInfo;
  public _commandTypeValueConstraints: ValueConstraint[] = [];
  private _commandTypeInstanceProperties: string[] = [];
  public _commandTypeAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _commandTypeAllowedVersionsV3: Set<number> = new Set<number>().add(3);
  public comment?: string;
  public description?: LanguageStringType;
  public displayName?: LanguageStringType;
  public languageVersion?: number;
  public name?: string;
  public namePropertyRegexPatternV2: RegExp = /^[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?$/;
  public namePropertyRegexPatternV3: RegExp = /^[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?$/;
  public request?: CommandPayloadInfo;
  public _requestValueConstraints: ValueConstraint[] = [];
  private _requestInstanceProperties: string[] = [];
  public _requestAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _requestAllowedVersionsV3: Set<number> = new Set<number>().add(3);
  public response?: CommandPayloadInfo;
  public _responseValueConstraints: ValueConstraint[] = [];
  private _responseInstanceProperties: string[] = [];
  public _responseAllowedVersionsV2: Set<number> = new Set<number>().add(2);
  public _responseAllowedVersionsV3: Set<number> = new Set<number>().add(3);
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
    entityKind: CommandKinds
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
    this._countOfExtendsNarrowStatus = TraversalStatus.NotStarted;
    this._countOfExtendsNarrowValue = 0;
    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.NotStarted;
    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue = 0;
  }

  static initialize() {
    this._versionlessTypes = new Set<string>()
      .add("dtmi:dtdl:class:Command")
      .add("dtmi:dtdl:class:Content")
      .add("dtmi:dtdl:class:Entity")
      .add("dtmi:dtdl:class:NamedEntity");
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
      CommandInfoImpl._versionlessTypes.has(new InDTMI(typeId).versionless) ||
      this.supplementalTypes.some((st) => (st as SupplementalTypeInfoImpl).doesHaveType(typeId))
    );
  }

  addConstraint(propertyName: string, valueConstraint: ValueConstraint): void {
    switch (propertyName) {
      case "commandType":
        if (this._commandTypeValueConstraints === undefined) {
          this._commandTypeValueConstraints = <ValueConstraint[]>[];
        }

        this._commandTypeValueConstraints.push(valueConstraint);
        break;
      case "request":
        if (this._requestValueConstraints === undefined) {
          this._requestValueConstraints = <ValueConstraint[]>[];
        }

        this._requestValueConstraints.push(valueConstraint);
        break;
      case "response":
        if (this._responseValueConstraints === undefined) {
          this._responseValueConstraints = <ValueConstraint[]>[];
        }

        this._responseValueConstraints.push(valueConstraint);
        break;
    }
  }

  addInstanceProperty(propertyName: string, instancePropertyName: string): void {
    switch (propertyName) {
      case "commandType":
        if (this._commandTypeInstanceProperties === undefined) {
          this._commandTypeInstanceProperties = <string[]>[];
        }

        this._commandTypeInstanceProperties.push(instancePropertyName);
        break;
      case "request":
        if (this._requestInstanceProperties === undefined) {
          this._requestInstanceProperties = <string[]>[];
        }

        this._requestInstanceProperties.push(instancePropertyName);
        break;
      case "response":
        if (this._responseInstanceProperties === undefined) {
          this._responseInstanceProperties = <string[]>[];
        }

        this._responseInstanceProperties.push(instancePropertyName);
        break;
    }
  }

  doesPropertyDictContainKey(propertyName: string, key: string | undefined): boolean {
    switch (propertyName) {
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
    throw new Error(`attempt to set partition info on non-partition type CommandInfoInfo`);
  }

  applyTransformations(model: Model, parsingErrors: ParsingError[]): void {
    if (this.dtdlVersion === 2) {
      this.applyTransformationsV2(model, parsingErrors);
    }

    if (this.dtdlVersion === 3) {
      this.applyTransformationsV3(model, parsingErrors);
    }
  }

  applyTransformationsV2(model: Model, parsingErrors: ParsingError[]) {}

  applyTransformationsV3(model: Model, parsingErrors: ParsingError[]) {}

  checkRestrictions(parsingErrors: ParsingError[]): void {
    if (this.dtdlVersion === 2) {
      this.checkRestrictionsV2(parsingErrors);
    }

    if (this.dtdlVersion === 3) {
      this.checkRestrictionsV3(parsingErrors);
    }
  }

  checkRestrictionsV2(parsingErrors: ParsingError[]) {
    if (this._commandTypeInstanceProperties !== undefined) {
      for (const instanceProp of this._commandTypeInstanceProperties) {
        if (
          !(this.commandType as CommandTypeInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'commandType' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'commandType'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }

    if (this._requestInstanceProperties !== undefined) {
      for (const instanceProp of this._requestInstanceProperties) {
        if (
          !(this.request as CommandPayloadInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'request' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'request'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }

    if (this._responseInstanceProperties !== undefined) {
      for (const instanceProp of this._responseInstanceProperties) {
        if (
          !(this.response as CommandPayloadInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'response' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'response'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }
  }

  checkRestrictionsV3(parsingErrors: ParsingError[]) {
    if (this._commandTypeInstanceProperties !== undefined) {
      for (const instanceProp of this._commandTypeInstanceProperties) {
        if (
          !(this.commandType as CommandTypeInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'commandType' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'commandType'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }

    if (this._requestInstanceProperties !== undefined) {
      for (const instanceProp of this._requestInstanceProperties) {
        if (
          !(this.request as CommandPayloadInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'request' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'request'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }

    if (this._responseInstanceProperties !== undefined) {
      for (const instanceProp of this._responseInstanceProperties) {
        if (
          !(this.response as CommandPayloadInfoImpl)?.validateInstanceElement(
            this.supplementalProperties[instanceProp]
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:nonConformantPropertyValue", {
              cause:
                "{{primaryId:n}} property '{{property}}' does not conform to the type specified by property 'response' ",
              action:
                "Change the value of property '{{property}}' so that it conforms to property  'response'",
              primaryId: this.id,
              property: instanceProp
            })
          );
        }
      }
    }
  }

  trySetObjectProperty(propertyName: string, value: any, key: string | undefined): boolean {
    switch (propertyName) {
      case "commandType":
      case "dtmi:dtdl:property:commandType;2":
      case "dtmi:dtdl:property:commandType;3":
        this.commandType = value as CommandTypeInfoImpl;
        return true;
      case "request":
      case "dtmi:dtdl:property:request;2":
      case "dtmi:dtdl:property:request;3":
        this.request = value as CommandPayloadInfoImpl;
        return true;
      case "response":
      case "dtmi:dtdl:property:response;2":
      case "dtmi:dtdl:property:response;3":
        this.response = value as CommandPayloadInfoImpl;
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
    parsingErrors: ParsingError[]
  ): boolean {
    if (this.commandType !== undefined) {
      if (
        !(this.commandType as EntityInfoImpl).checkDepthOfElementSchemaOrSchema(
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

    if (this.request !== undefined) {
      if (
        !(this.request as EntityInfoImpl).checkDepthOfElementSchemaOrSchema(
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

    if (this.response !== undefined) {
      if (
        !(this.response as EntityInfoImpl).checkDepthOfElementSchemaOrSchema(
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
    ancestorId: InDTMI,
    datatype: string,
    parsingErrors: ParsingError[]
  ): void {
    if (this._checkedDescendantEnumValueDatatype !== datatype) {
      this._checkedDescendantEnumValueDatatype = datatype;
    }

    if (this.commandType !== undefined) {
      (this.commandType as EntityInfoImpl).checkDescendantEnumValueDataType(
        ancestorId,
        datatype,
        parsingErrors
      );
    }

    if (this.request !== undefined) {
      (this.request as EntityInfoImpl).checkDescendantEnumValueDataType(
        ancestorId,
        datatype,
        parsingErrors
      );
    }

    if (this.response !== undefined) {
      (this.response as EntityInfoImpl).checkDescendantEnumValueDataType(
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

    if (this.commandType !== undefined) {
      if ((this.commandType as EntityInfoImpl).tryGetDescendantSchemaArray(elementId)) {
        this._idOfDescendantSchemaArray = elementId.ref;
        return true;
      }
    }

    if (this.request !== undefined) {
      if ((this.request as EntityInfoImpl).tryGetDescendantSchemaArray(elementId)) {
        this._idOfDescendantSchemaArray = elementId.ref;
        return true;
      }
    }

    if (this.response !== undefined) {
      if ((this.response as EntityInfoImpl).tryGetDescendantSchemaArray(elementId)) {
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
    if (this.request !== undefined) {
      this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue +=
        (this
          .request as EntityInfoImpl).getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
          parsingErrors
        ) + 1;
    }

    if (this.response !== undefined) {
      this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue +=
        (this
          .response as EntityInfoImpl).getCountOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrow(
          parsingErrors
        ) + 1;
    }

    this._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowStatus =
      TraversalStatus.Complete;
    return this
      ._countOfContentsOrFieldsOrEnumValuesOrRequestOrResponseOrPropertiesOrSchemaOrElementSchemaOrMapValueNarrowValue;
  }
}

CommandInfoImpl.initialize();
