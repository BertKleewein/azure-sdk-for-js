// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { EntityInfoImpl } from "./entityInfoImpl";
import { EntityInfo } from "./entityInfo";
import { EntityKinds } from "./entityKinds";
import { IdValidator } from "./idValidator";
import { ParsingError } from "./parsingError";
import { createParsingError } from "./parsingErrorImpl";
import { AggregateContext } from "./aggregateContext";
import { InDTMI } from "./internalDtmi";
import { Reference, referenceInit } from "../common/reference";
import { Model } from "./model";
import { ParsedObjectPropertyInfo } from "./parsedObjectPropertyInfo";
import { ElementPropertyConstraint } from "./type";
import { ValueConstraint } from "./type/valueConstraint";
import { SupplementalTypeInfoStatic } from "./supplementalTypeInfoStatic";
import { ArrayInfoImpl } from "./arrayInfoImpl";
import { ArrayInfoParser } from "./arrayInfoParser";
import { BooleanInfoImpl } from "./booleanInfoImpl";
import { BooleanInfoParser } from "./booleanInfoParser";
import { CommandInfoImpl } from "./commandInfoImpl";
import { CommandInfoParser } from "./commandInfoParser";
import { CommandPayloadInfoImpl } from "./commandPayloadInfoImpl";
import { CommandPayloadInfoParser } from "./commandPayloadInfoParser";
import { CommandTypeInfoImpl } from "./commandTypeInfoImpl";
import { CommandTypeInfoParser } from "./commandTypeInfoParser";
import { ComponentInfoImpl } from "./componentInfoImpl";
import { ComponentInfoParser } from "./componentInfoParser";
import { DateInfoImpl } from "./dateInfoImpl";
import { DateInfoParser } from "./dateInfoParser";
import { DateTimeInfoImpl } from "./dateTimeInfoImpl";
import { DateTimeInfoParser } from "./dateTimeInfoParser";
import { DoubleInfoImpl } from "./doubleInfoImpl";
import { DoubleInfoParser } from "./doubleInfoParser";
import { DurationInfoImpl } from "./durationInfoImpl";
import { DurationInfoParser } from "./durationInfoParser";
import { EnumInfoImpl } from "./enumInfoImpl";
import { EnumInfoParser } from "./enumInfoParser";
import { EnumValueInfoImpl } from "./enumValueInfoImpl";
import { EnumValueInfoParser } from "./enumValueInfoParser";
import { FieldInfoImpl } from "./fieldInfoImpl";
import { FieldInfoParser } from "./fieldInfoParser";
import { FloatInfoImpl } from "./floatInfoImpl";
import { FloatInfoParser } from "./floatInfoParser";
import { IntegerInfoImpl } from "./integerInfoImpl";
import { IntegerInfoParser } from "./integerInfoParser";
import { InterfaceInfoImpl } from "./interfaceInfoImpl";
import { InterfaceInfoParser } from "./interfaceInfoParser";
import { LongInfoImpl } from "./longInfoImpl";
import { LongInfoParser } from "./longInfoParser";
import { MapInfoImpl } from "./mapInfoImpl";
import { MapInfoParser } from "./mapInfoParser";
import { MapKeyInfoImpl } from "./mapKeyInfoImpl";
import { MapKeyInfoParser } from "./mapKeyInfoParser";
import { MapValueInfoImpl } from "./mapValueInfoImpl";
import { MapValueInfoParser } from "./mapValueInfoParser";
import { ObjectInfoImpl } from "./objectInfoImpl";
import { ObjectInfoParser } from "./objectInfoParser";
import { PropertyInfoImpl } from "./propertyInfoImpl";
import { PropertyInfoParser } from "./propertyInfoParser";
import { RelationshipInfoImpl } from "./relationshipInfoImpl";
import { RelationshipInfoParser } from "./relationshipInfoParser";
import { StringInfoImpl } from "./stringInfoImpl";
import { StringInfoParser } from "./stringInfoParser";
import { TelemetryInfoImpl } from "./telemetryInfoImpl";
import { TelemetryInfoParser } from "./telemetryInfoParser";
import { TimeInfoImpl } from "./timeInfoImpl";
import { TimeInfoParser } from "./timeInfoParser";
import { MaterialTypeNameCollection } from "./materialTypeNameCollection";
import { ExtensionKind } from "./extensionKind";
import { UnitInfoImpl } from "./unitInfoImpl";
import { UnitInfoParser } from "./unitInfoParser";
import { UnitAttributeInfoImpl } from "./unitAttributeInfoImpl";
import { UnitAttributeInfoParser } from "./unitAttributeInfoParser";
import { ValueParser } from "./valueParser";
import { CommandRequestInfoImpl } from "./commandRequestInfoImpl";
import { CommandRequestInfoParser } from "./commandRequestInfoParser";
import { CommandResponseInfoImpl } from "./commandResponseInfoImpl";
import { CommandResponseInfoParser } from "./commandResponseInfoParser";
import { LatentTypeInfoImpl } from "./latentTypeInfoImpl";
import { LatentTypeInfoParser } from "./latentTypeInfoParser";
import { NamedLatentTypeInfoImpl } from "./namedLatentTypeInfoImpl";
import { NamedLatentTypeInfoParser } from "./namedLatentTypeInfoParser";
export class EntityInfoParser {
  protected static _concreteKinds: { [x: number]: EntityKinds[] };
  protected static _badTypeActionFormat: { [x: number]: string };
  protected static _badTypeCauseFormat: { [x: number]: string };

  static initialize(): void {
    this._concreteKinds = {};
    this._concreteKinds[2] = [];
    this._concreteKinds[2].push("array");
    this._concreteKinds[2].push("boolean");
    this._concreteKinds[2].push("command");
    this._concreteKinds[2].push("commandpayload");
    this._concreteKinds[2].push("commandtype");
    this._concreteKinds[2].push("component");
    this._concreteKinds[2].push("date");
    this._concreteKinds[2].push("datetime");
    this._concreteKinds[2].push("double");
    this._concreteKinds[2].push("duration");
    this._concreteKinds[2].push("enum");
    this._concreteKinds[2].push("enumvalue");
    this._concreteKinds[2].push("field");
    this._concreteKinds[2].push("float");
    this._concreteKinds[2].push("integer");
    this._concreteKinds[2].push("interface");
    this._concreteKinds[2].push("long");
    this._concreteKinds[2].push("map");
    this._concreteKinds[2].push("mapkey");
    this._concreteKinds[2].push("mapvalue");
    this._concreteKinds[2].push("object");
    this._concreteKinds[2].push("property");
    this._concreteKinds[2].push("relationship");
    this._concreteKinds[2].push("string");
    this._concreteKinds[2].push("telemetry");
    this._concreteKinds[2].push("time");
    this._concreteKinds[3] = [];
    this._concreteKinds[3].push("array");
    this._concreteKinds[3].push("boolean");
    this._concreteKinds[3].push("command");
    this._concreteKinds[3].push("commandrequest");
    this._concreteKinds[3].push("commandresponse");
    this._concreteKinds[3].push("commandtype");
    this._concreteKinds[3].push("component");
    this._concreteKinds[3].push("date");
    this._concreteKinds[3].push("datetime");
    this._concreteKinds[3].push("double");
    this._concreteKinds[3].push("duration");
    this._concreteKinds[3].push("enum");
    this._concreteKinds[3].push("enumvalue");
    this._concreteKinds[3].push("field");
    this._concreteKinds[3].push("float");
    this._concreteKinds[3].push("integer");
    this._concreteKinds[3].push("interface");
    this._concreteKinds[3].push("long");
    this._concreteKinds[3].push("map");
    this._concreteKinds[3].push("mapkey");
    this._concreteKinds[3].push("mapvalue");
    this._concreteKinds[3].push("object");
    this._concreteKinds[3].push("property");
    this._concreteKinds[3].push("relationship");
    this._concreteKinds[3].push("string");
    this._concreteKinds[3].push("telemetry");
    this._concreteKinds[3].push("time");
    this._badTypeActionFormat = {};
    this._badTypeCauseFormat = {};
    this._badTypeActionFormat[2] = `Provide a @type in the set of allowable types.`;
    this._badTypeActionFormat[3] = `Provide a @type in the set of allowable types.`;
    this._badTypeCauseFormat[2] = `Top-level element{secondaryId:e} does not have @type of Array, Command, CommandPayload, Component, Enum, EnumValue, Field, Interface, Map, MapKey, MapValue, Object, Property, Relationship, or Telemetry.`;
    this._badTypeCauseFormat[3] = `Top-level element{secondaryId:e} does not have @type of Array, Command, CommandRequest, CommandResponse, Component, Enum, EnumValue, Field, Interface, Map, MapKey, MapValue, Object, Property, Relationship, or Telemetry.`;
  }

  static parseObject(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    valueConstraints: ValueConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: { [index: string]: any },
    parentId: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    propName: string | undefined,
    dtmiSeg: string | undefined,
    keyProp: string | undefined,
    idRequired: boolean,
    typeRequired: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    allowIdReferenceSyntax: boolean,
    allowedVersions: Set<number>
  ): any {
    // This is a method to parse the object read from DTDL into a type of EntityInfo
    const childAggregateContext = aggregateContext.getChildContext(object, parsingErrors);
    if (
      Object.keys(object).length === 1 &&
      Object.prototype.hasOwnProperty.call(object, "@id") &&
      typeof object["@id"] === "string"
    ) {
      if (allowIdReferenceSyntax && parentId !== undefined) {
        this.parseIdString(
          objectPropertyInfoList,
          elementPropertyConstraints,
          valueConstraints,
          childAggregateContext,
          parsingErrors,
          object["@id"],
          parentId,
          propName,
          keyProp,
          allowedVersions
        );
        return;
      } else {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:idReference", {
            cause: `{primaryId:p} property '{property}' has an inline definition containing nothing but an '@id' property.`,
            action: `Replace the inline definition with a string value of '{secondaryId}', or provide a complete inline definition for property '{property}'.`,
            primaryId: parentId,
            property: propName,
            secondaryId: object["@id"]
          })
        );
        return;
      }
    }

    if (
      allowedVersions !== undefined &&
      allowedVersions.size !== 0 &&
      !allowedVersions.has(childAggregateContext.dtdlVersion)
    ) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:disallowedVersionDefinition", {
          cause: `{primaryId:p} property '{property}' has a value that specifies DTDL context version ${childAggregateContext.dtdlVersion}, which is not allowed for this property.`,
          action: `Change the DTDL context version of property '{property}' to one of the following: ${Array.from(
            allowedVersions.values()
          ).join(" ,")}.`,
          primaryId: parentId,
          property: propName
        })
      );
    }

    const typeToken = object["@type"];
    let typeTokenArr: any[] = [];
    const elementId = IdValidator.parseIdProperty(
      object,
      parentId !== undefined ? parentId : "",
      propName,
      dtmiSeg,
      idRequired,
      parsingErrors,
      childAggregateContext.dtdlVersion
    );
    if (elementId === undefined || elementId === null) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(model.dict, elementId)) {
      const elementDtmi = InDTMI.createDtmi(elementId);
      if (!elementDtmi?.isReserved) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:duplicateDefinition", {
            cause: `{primaryId:p} has more than one definition.`,
            action: `Remove all but one JSON object containing '@id' property with value {primaryId}, or change the '@id' values so there are no duplicates.`,
            primaryId: elementId
          })
        );
      } else if (dtmiSeg !== undefined) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:nonUniquePropertyValue", {
            cause: `{primaryId:p} property ${propName} contains more than one element whose property '{dtmiSeg}' has value ${dtmiSeg}`,
            action: `Change the value of property ${dtmiSeg} to a string value that is unique across all values of ${propName}.`,
            primaryId: parentId,
            property: propName,
            value: dtmiSeg
          })
        );
      }

      return;
    }

    if (typeRequired && typeToken === undefined) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:badType", {
          cause: this._badTypeCauseFormat[childAggregateContext.dtdlVersion],
          action: this._badTypeActionFormat[childAggregateContext.dtdlVersion],
          primaryId: parentId,
          property: propName,
          secondaryId: elementId
        })
      );
      return;
    }

    if (typeToken === undefined) {
      typeTokenArr = ["Entity"];
    } else if (!Array.isArray(typeToken)) {
      typeTokenArr = [typeToken];
    } else {
      typeTokenArr = typeToken;
    }

    const elementInfo = this.parseTypeArray(
      typeTokenArr,
      elementId,
      parentId,
      definedIn,
      propName,
      childAggregateContext,
      parsingErrors
    ) as EntityInfoImpl;
    if (elementInfo === undefined) {
      return;
    }

    elementInfo.sourceObject = object;
    switch (childAggregateContext.dtdlVersion) {
      case 2: {
        elementInfo.parserClass.parsePropertiesV2(
          model,
          elementInfo,
          objectPropertyInfoList,
          elementPropertyConstraints,
          childAggregateContext,
          parsingErrors,
          object,
          definedIn,
          allowIdReferenceSyntax
        );
        break;
      }

      case 3: {
        elementInfo.parserClass.parsePropertiesV3(
          model,
          elementInfo,
          objectPropertyInfoList,
          elementPropertyConstraints,
          childAggregateContext,
          parsingErrors,
          object,
          definedIn,
          allowIdReferenceSyntax
        );
        break;
      }
    }

    model.dict[elementId] = elementInfo;
    if (parentId !== undefined) {
      const objectPropertyInfo: ParsedObjectPropertyInfo = {
        elementId: parentId,
        propertyName: propName || "",
        referencedElementId: elementId,
        keyProperty: keyProp,
        expectedKinds: [],
        allowedVersions: new Set<number>(),
        badTypeCauseFormat: undefined,
        badTypeActionFormat: undefined
      };
      objectPropertyInfoList.push(objectPropertyInfo);
      if (valueConstraints !== undefined && elementPropertyConstraints !== undefined) {
        for (const vc of valueConstraints) {
          const elementPropertyConstraint = {
            parentId: parentId,
            propertyName: propName,
            elementId: elementId,
            valueConstraint: vc
          };
          elementPropertyConstraints.push(elementPropertyConstraint);
        }
      }
    }
  }

  static parseTypeArray(
    tokenArr: any[],
    elementId: string,
    parentId: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    propName: string | undefined,
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[]
  ): EntityInfo | undefined {
    const materialKinds: EntityKinds[] = [];
    const elementInfo: Reference<EntityInfo> = referenceInit<EntityInfo>();
    let anyFailures = false;
    const supplementalTypeIds: string[] = [];
    const undefinedTypes: string[] = [];
    for (const element of tokenArr) {
      if (typeof element !== "string") {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:badType", {
            cause: this._badTypeCauseFormat[aggregateContext.dtdlVersion],
            action: this._badTypeActionFormat[aggregateContext.dtdlVersion],
            primaryId: parentId,
            property: propName,
            secondaryId: elementId,
            value: element
          })
        );
        return undefined;
      }

      switch (aggregateContext.dtdlVersion) {
        case 2: {
          if (
            !this.tryParseTypeStringV2(
              element.toString(),
              elementId,
              parentId,
              definedIn,
              propName,
              materialKinds,
              supplementalTypeIds,
              elementInfo,
              undefinedTypes,
              aggregateContext,
              parsingErrors
            )
          ) {
            anyFailures = true;
          }

          break;
        }

        case 3: {
          if (
            !this.tryParseTypeStringV3(
              element.toString(),
              elementId,
              parentId,
              definedIn,
              propName,
              materialKinds,
              supplementalTypeIds,
              elementInfo,
              undefinedTypes,
              aggregateContext,
              parsingErrors
            )
          ) {
            anyFailures = true;
          }

          break;
        }
      }
    }

    if (anyFailures) {
      return undefined;
    }

    if (elementInfo.ref === undefined) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:badType", {
          cause: this._badTypeCauseFormat[aggregateContext.dtdlVersion],
          action: this._badTypeActionFormat[aggregateContext.dtdlVersion],
          primaryId: parentId,
          property: propName,
          secondaryId: elementId
        })
      );
      return undefined;
    }

    if (materialKinds.length > 1) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:multipleMaterialTypes", {
          cause: `{primaryId:p} has @type that specifies multiple material types: ${materialKinds.join(
            " ,"
          )}`,
          action: `Remove excess @type values so that only one material type remains.`,
          primaryId: elementId
        })
      );
      return undefined;
    }

    elementInfo.ref.undefinedTypes = undefinedTypes;
    for (const supplementalTypeId of supplementalTypeIds) {
      const supplementalTypeInfo = SupplementalTypeInfoStatic.retrieveSupplementalTypeCollection().supplementalTypes.get(
        supplementalTypeId
      );
      if (elementInfo.ref !== undefined && elementInfo.ref.entityKind !== undefined) {
        if (
          !(supplementalTypeInfo as SupplementalTypeInfoImpl)?.allowedCotypeKinds.includes(
            elementInfo.ref.entityKind
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:invalidCotype", {
              cause: `{primaryId:p} has @type {value} that can only be applied to elements of @type ${(supplementalTypeInfo as SupplementalTypeInfoImpl)?.allowedCotypeKinds.join(
                " or "
              )} + '.'`,
              action: `Remove @type '{value}' from element.`,
              primaryId: elementId,
              value: AggregateContext.getTermOrUri(supplementalTypeId)
            })
          );
        } else if (
          !(supplementalTypeInfo as SupplementalTypeInfoImpl)?.allowedCotypeVersions.includes(
            elementInfo.ref.dtdlVersion
          )
        ) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:invalidCotypeVersion", {
              cause: `{primaryId:p} has @type {value} that can only be applied to elements defined in DTDL version ${(supplementalTypeInfo as SupplementalTypeInfoImpl)?.allowedCotypeVersions.join(
                " or "
              )} + '.'`,
              action: `Remove @type '{value}' from element.`,
              primaryId: elementId,
              value: AggregateContext.getTermOrUri(supplementalTypeId)
            })
          );
        } else {
          (elementInfo.ref as EntityInfoImpl).addType(supplementalTypeId, supplementalTypeInfo);
        }
      }
    }

    return elementInfo.ref;
    // this ends the method.
  }

  static tryParseTypeStringV2(
    typestring: string,
    elementId: string,
    parentId: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    propName: string | undefined,
    materialKinds: EntityKinds[],
    supplementalTypeIds: string[],
    elementInfo: Reference<EntityInfo>,
    undefinedTypes: string[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[]
  ): boolean {
    switch (typestring) {
      case "Array":
      case "dtmi:dtdl:class:Array;2":
        elementInfo.ref = new ArrayInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "array",
          ArrayInfoParser
        );
        materialKinds.push("array");
        return true;
      case "Boolean":
      case "dtmi:dtdl:class:Boolean;2":
        elementInfo.ref = new BooleanInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "boolean",
          BooleanInfoParser
        );
        materialKinds.push("boolean");
        return true;
      case "Command":
      case "dtmi:dtdl:class:Command;2":
        elementInfo.ref = new CommandInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "command",
          CommandInfoParser
        );
        materialKinds.push("command");
        return true;
      case "CommandPayload":
      case "dtmi:dtdl:class:CommandPayload;2":
        elementInfo.ref = new CommandPayloadInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "commandpayload",
          CommandPayloadInfoParser
        );
        materialKinds.push("commandpayload");
        return true;
      case "CommandType":
      case "dtmi:dtdl:class:CommandType;2":
        elementInfo.ref = new CommandTypeInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "commandtype",
          CommandTypeInfoParser
        );
        materialKinds.push("commandtype");
        return true;
      case "Component":
      case "dtmi:dtdl:class:Component;2":
        elementInfo.ref = new ComponentInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "component",
          ComponentInfoParser
        );
        materialKinds.push("component");
        return true;
      case "Date":
      case "dtmi:dtdl:class:Date;2":
        elementInfo.ref = new DateInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "date",
          DateInfoParser
        );
        materialKinds.push("date");
        return true;
      case "DateTime":
      case "dtmi:dtdl:class:DateTime;2":
        elementInfo.ref = new DateTimeInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "datetime",
          DateTimeInfoParser
        );
        materialKinds.push("datetime");
        return true;
      case "Double":
      case "dtmi:dtdl:class:Double;2":
        elementInfo.ref = new DoubleInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "double",
          DoubleInfoParser
        );
        materialKinds.push("double");
        return true;
      case "Duration":
      case "dtmi:dtdl:class:Duration;2":
        elementInfo.ref = new DurationInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "duration",
          DurationInfoParser
        );
        materialKinds.push("duration");
        return true;
      case "Enum":
      case "dtmi:dtdl:class:Enum;2":
        elementInfo.ref = new EnumInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "enum",
          EnumInfoParser
        );
        materialKinds.push("enum");
        return true;
      case "EnumValue":
      case "dtmi:dtdl:class:EnumValue;2":
        elementInfo.ref = new EnumValueInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "enumvalue",
          EnumValueInfoParser
        );
        materialKinds.push("enumvalue");
        return true;
      case "Field":
      case "dtmi:dtdl:class:Field;2":
        elementInfo.ref = new FieldInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "field",
          FieldInfoParser
        );
        materialKinds.push("field");
        return true;
      case "Float":
      case "dtmi:dtdl:class:Float;2":
        elementInfo.ref = new FloatInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "float",
          FloatInfoParser
        );
        materialKinds.push("float");
        return true;
      case "Integer":
      case "dtmi:dtdl:class:Integer;2":
        elementInfo.ref = new IntegerInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "integer",
          IntegerInfoParser
        );
        materialKinds.push("integer");
        return true;
      case "Interface":
      case "dtmi:dtdl:class:Interface;2":
        if (elementId.length > 128) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:idTooLongForInterface", {
              cause:
                "Identifier '{{{{primaryId}}}}' is too long for an element with @type Interface -- length limit for this type is 128.",
              action:
                "Select a shorter value for the identifier or trim current value to fewer than 128 characters.",
              primaryId: elementId,
              property: "@id"
            })
          );
        }

        elementInfo.ref = new InterfaceInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "interface",
          InterfaceInfoParser
        );
        materialKinds.push("interface");
        return true;
      case "Long":
      case "dtmi:dtdl:class:Long;2":
        elementInfo.ref = new LongInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "long",
          LongInfoParser
        );
        materialKinds.push("long");
        return true;
      case "Map":
      case "dtmi:dtdl:class:Map;2":
        elementInfo.ref = new MapInfoImpl(2, elementId, parentId, definedIn, "map", MapInfoParser);
        materialKinds.push("map");
        return true;
      case "MapKey":
      case "dtmi:dtdl:class:MapKey;2":
        elementInfo.ref = new MapKeyInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "mapkey",
          MapKeyInfoParser
        );
        materialKinds.push("mapkey");
        return true;
      case "MapValue":
      case "dtmi:dtdl:class:MapValue;2":
        elementInfo.ref = new MapValueInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "mapvalue",
          MapValueInfoParser
        );
        materialKinds.push("mapvalue");
        return true;
      case "Object":
      case "dtmi:dtdl:class:Object;2":
        elementInfo.ref = new ObjectInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "object",
          ObjectInfoParser
        );
        materialKinds.push("object");
        return true;
      case "Property":
      case "dtmi:dtdl:class:Property;2":
        elementInfo.ref = new PropertyInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "property",
          PropertyInfoParser
        );
        materialKinds.push("property");
        return true;
      case "Relationship":
      case "dtmi:dtdl:class:Relationship;2":
        elementInfo.ref = new RelationshipInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "relationship",
          RelationshipInfoParser
        );
        materialKinds.push("relationship");
        return true;
      case "String":
      case "dtmi:dtdl:class:String;2":
        elementInfo.ref = new StringInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "string",
          StringInfoParser
        );
        materialKinds.push("string");
        return true;
      case "Telemetry":
      case "dtmi:dtdl:class:Telemetry;2":
        elementInfo.ref = new TelemetryInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "telemetry",
          TelemetryInfoParser
        );
        materialKinds.push("telemetry");
        return true;
      case "Time":
      case "dtmi:dtdl:class:Time;2":
        elementInfo.ref = new TimeInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "time",
          TimeInfoParser
        );
        materialKinds.push("time");
        return true;
    }
    if (MaterialTypeNameCollection.isMaterialType(typestring)) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:badType", {
          cause: this._badTypeCauseFormat[2],
          action: this._badTypeActionFormat[2],
          primaryId: parentId,
          property: propName,
          secondaryId: elementId,
          value: typestring
        })
      );
    }

    const supplementalTypeId = aggregateContext.createDtmi(typestring);
    if (supplementalTypeId === undefined) {
      if (undefinedTypes === undefined) {
        undefinedTypes = [];
      }

      undefinedTypes.push(typestring);
      return true;
    }

    const mapOfInDTMIToSupplementalTypeInfo = SupplementalTypeInfoStatic.retrieveSupplementalTypeCollection()
      .supplementalTypes;
    if (
      supplementalTypeId !== undefined &&
      !mapOfInDTMIToSupplementalTypeInfo.has(supplementalTypeId.value)
    ) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:badType", {
          cause: this._badTypeCauseFormat[2],
          action: this._badTypeActionFormat[2],
          primaryId: parentId,
          property: propName,
          secondaryId: elementId,
          value: typestring
        })
      );
      return false;
    }

    if (supplementalTypeId !== undefined) {
      const supplementalTypeInfo = mapOfInDTMIToSupplementalTypeInfo.get(supplementalTypeId.value);
      if (supplementalTypeInfo?.isAbstract) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:abstractSupplementalType", {
            cause: `{primaryId:p} has @type that specifies supplemental type {value} that is abstract.`,
            action: `Remove @type {value} or replace with a concrete subtype of {value}.`,
            primaryId: elementId,
            property: "@type",
            value: AggregateContext.getTermOrUri(supplementalTypeId.value)
          })
        );
      }

      switch ((supplementalTypeInfo as SupplementalTypeInfoImpl)?.extensionKind) {
        case ExtensionKind.UNIT:
          elementInfo.ref = new UnitInfoImpl(
            2,
            elementId,
            parentId,
            definedIn,
            "unit",
            UnitInfoParser
          );
          (elementInfo.ref as UnitInfoImpl).addType(supplementalTypeId.value, supplementalTypeInfo);
          materialKinds.push("unit");
          return true;
        case ExtensionKind.UNITATTRIBUTE:
          elementInfo.ref = new UnitAttributeInfoImpl(
            2,
            elementId,
            parentId,
            definedIn,
            "unitattribute",
            UnitAttributeInfoParser
          );
          (elementInfo.ref as UnitAttributeInfoImpl).addType(
            supplementalTypeId.value,
            supplementalTypeInfo
          );
          materialKinds.push("unitattribute");
          return true;
      }

      supplementalTypeIds.push(supplementalTypeId.value);
      return true;
    }

    return true;
  }

  static parsePropertiesV2(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    elementInfo: EntityInfoImpl,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: { [index: string]: any },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    allowIdReferenceSyntax: boolean
  ): void {
    elementInfo.languageVersion = 2;

    for (const propKey in object) {
      const propValue = object[propKey];
      if (propValue === undefined || propValue === null) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:propertyValueNull", {
            cause: `{primaryId:p} property '{property}' has value null, which is not allowed in DTDL models.`,
            action: `Change the value of '{property}' to a value that is legal for this property.`,
            primaryId: elementInfo.id,
            property: propKey
          })
        );
        continue;
      }

      if (propKey[0] === "@") {
        continue;
      }

      switch (propKey) {
        case "comment":
        case "dtmi:dtdl:property:comment;2":
          elementInfo.comment = ValueParser.parseSingularStringToken(
            elementInfo.id,
            "comment",
            propValue,
            512,
            undefined,
            parsingErrors
          );
          continue;
        case "description":
        case "dtmi:dtdl:property:description;2":
          elementInfo.description = ValueParser.parseLangStringToken(
            elementInfo.id,
            "description",
            propValue,
            "en",
            512,
            undefined,
            parsingErrors
          );
          continue;
        case "displayName":
        case "dtmi:dtdl:property:displayName;2":
          elementInfo.displayName = ValueParser.parseLangStringToken(
            elementInfo.id,
            "displayName",
            propValue,
            "en",
            64,
            undefined,
            parsingErrors
          );
          continue;
      }

      if (elementInfo.undefinedTypes !== undefined && elementInfo.undefinedTypes.length > 0) {
        elementInfo.undefinedProperties[propKey] = propValue;
      } else {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:noTypeThatAllows", {
            cause: `{primaryId:p} does not have a @type that allows property ${propKey}.`,
            action: `Remove property ${propKey} or correct if misspelled.`,
            primaryId: elementInfo.id,
            property: propKey
          })
        );
      }
    }

    for (const supplementalType of elementInfo.supplementalTypes) {
      (supplementalType as SupplementalTypeInfoImpl).checkForRequiredProperties(
        parsingErrors,
        elementInfo.id,
        elementInfo.supplementalProperties
      );
    }
  }

  static tryParseTypeStringV3(
    typestring: string,
    elementId: string,
    parentId: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    propName: string | undefined,
    materialKinds: EntityKinds[],
    supplementalTypeIds: string[],
    elementInfo: Reference<EntityInfo>,
    undefinedTypes: string[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[]
  ): boolean {
    switch (typestring) {
      case "Array":
      case "dtmi:dtdl:class:Array;3":
        elementInfo.ref = new ArrayInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "array",
          ArrayInfoParser
        );
        materialKinds.push("array");
        return true;
      case "Boolean":
      case "dtmi:dtdl:class:Boolean;3":
        elementInfo.ref = new BooleanInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "boolean",
          BooleanInfoParser
        );
        materialKinds.push("boolean");
        return true;
      case "Command":
      case "dtmi:dtdl:class:Command;3":
        elementInfo.ref = new CommandInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "command",
          CommandInfoParser
        );
        materialKinds.push("command");
        return true;
      case "CommandRequest":
      case "dtmi:dtdl:class:CommandRequest;3":
        elementInfo.ref = new CommandRequestInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "commandrequest",
          CommandRequestInfoParser
        );
        materialKinds.push("commandrequest");
        return true;
      case "CommandResponse":
      case "dtmi:dtdl:class:CommandResponse;3":
        elementInfo.ref = new CommandResponseInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "commandresponse",
          CommandResponseInfoParser
        );
        materialKinds.push("commandresponse");
        return true;
      case "CommandType":
      case "dtmi:dtdl:class:CommandType;3":
        elementInfo.ref = new CommandTypeInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "commandtype",
          CommandTypeInfoParser
        );
        materialKinds.push("commandtype");
        return true;
      case "Component":
      case "dtmi:dtdl:class:Component;3":
        elementInfo.ref = new ComponentInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "component",
          ComponentInfoParser
        );
        materialKinds.push("component");
        return true;
      case "Date":
      case "dtmi:dtdl:class:Date;3":
        elementInfo.ref = new DateInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "date",
          DateInfoParser
        );
        materialKinds.push("date");
        return true;
      case "DateTime":
      case "dtmi:dtdl:class:DateTime;3":
        elementInfo.ref = new DateTimeInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "datetime",
          DateTimeInfoParser
        );
        materialKinds.push("datetime");
        return true;
      case "Double":
      case "dtmi:dtdl:class:Double;3":
        elementInfo.ref = new DoubleInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "double",
          DoubleInfoParser
        );
        materialKinds.push("double");
        return true;
      case "Duration":
      case "dtmi:dtdl:class:Duration;3":
        elementInfo.ref = new DurationInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "duration",
          DurationInfoParser
        );
        materialKinds.push("duration");
        return true;
      case "Enum":
      case "dtmi:dtdl:class:Enum;3":
        elementInfo.ref = new EnumInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "enum",
          EnumInfoParser
        );
        materialKinds.push("enum");
        return true;
      case "EnumValue":
      case "dtmi:dtdl:class:EnumValue;3":
        elementInfo.ref = new EnumValueInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "enumvalue",
          EnumValueInfoParser
        );
        materialKinds.push("enumvalue");
        return true;
      case "Field":
      case "dtmi:dtdl:class:Field;3":
        elementInfo.ref = new FieldInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "field",
          FieldInfoParser
        );
        materialKinds.push("field");
        return true;
      case "Float":
      case "dtmi:dtdl:class:Float;3":
        elementInfo.ref = new FloatInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "float",
          FloatInfoParser
        );
        materialKinds.push("float");
        return true;
      case "Integer":
      case "dtmi:dtdl:class:Integer;3":
        elementInfo.ref = new IntegerInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "integer",
          IntegerInfoParser
        );
        materialKinds.push("integer");
        return true;
      case "Interface":
      case "dtmi:dtdl:class:Interface;3":
        if (elementId.length > 128) {
          parsingErrors.push(
            createParsingError("dtmi:dtdl:parsingError:idTooLongForInterface", {
              cause:
                "Identifier '{{{{primaryId}}}}' is too long for an element with @type Interface -- length limit for this type is 128.",
              action:
                "Select a shorter value for the identifier or trim current value to fewer than 128 characters.",
              primaryId: elementId,
              property: "@id"
            })
          );
        }

        elementInfo.ref = new InterfaceInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "interface",
          InterfaceInfoParser
        );
        materialKinds.push("interface");
        return true;
      case "Long":
      case "dtmi:dtdl:class:Long;3":
        elementInfo.ref = new LongInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "long",
          LongInfoParser
        );
        materialKinds.push("long");
        return true;
      case "Map":
      case "dtmi:dtdl:class:Map;3":
        elementInfo.ref = new MapInfoImpl(3, elementId, parentId, definedIn, "map", MapInfoParser);
        materialKinds.push("map");
        return true;
      case "MapKey":
      case "dtmi:dtdl:class:MapKey;3":
        elementInfo.ref = new MapKeyInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "mapkey",
          MapKeyInfoParser
        );
        materialKinds.push("mapkey");
        return true;
      case "MapValue":
      case "dtmi:dtdl:class:MapValue;3":
        elementInfo.ref = new MapValueInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "mapvalue",
          MapValueInfoParser
        );
        materialKinds.push("mapvalue");
        return true;
      case "Object":
      case "dtmi:dtdl:class:Object;3":
        elementInfo.ref = new ObjectInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "object",
          ObjectInfoParser
        );
        materialKinds.push("object");
        return true;
      case "Property":
      case "dtmi:dtdl:class:Property;3":
        elementInfo.ref = new PropertyInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "property",
          PropertyInfoParser
        );
        materialKinds.push("property");
        return true;
      case "Relationship":
      case "dtmi:dtdl:class:Relationship;3":
        elementInfo.ref = new RelationshipInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "relationship",
          RelationshipInfoParser
        );
        materialKinds.push("relationship");
        return true;
      case "String":
      case "dtmi:dtdl:class:String;3":
        elementInfo.ref = new StringInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "string",
          StringInfoParser
        );
        materialKinds.push("string");
        return true;
      case "Telemetry":
      case "dtmi:dtdl:class:Telemetry;3":
        elementInfo.ref = new TelemetryInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "telemetry",
          TelemetryInfoParser
        );
        materialKinds.push("telemetry");
        return true;
      case "Time":
      case "dtmi:dtdl:class:Time;3":
        elementInfo.ref = new TimeInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "time",
          TimeInfoParser
        );
        materialKinds.push("time");
        return true;
    }
    if (MaterialTypeNameCollection.isMaterialType(typestring)) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:badType", {
          cause: this._badTypeCauseFormat[3],
          action: this._badTypeActionFormat[3],
          primaryId: parentId,
          property: propName,
          secondaryId: elementId,
          value: typestring
        })
      );
    }

    const supplementalTypeId = aggregateContext.createDtmi(typestring);
    if (supplementalTypeId === undefined) {
      if (undefinedTypes === undefined) {
        undefinedTypes = [];
      }

      undefinedTypes.push(typestring);
      return true;
    }

    const mapOfInDTMIToSupplementalTypeInfo = SupplementalTypeInfoStatic.retrieveSupplementalTypeCollection()
      .supplementalTypes;
    if (
      supplementalTypeId !== undefined &&
      !mapOfInDTMIToSupplementalTypeInfo.has(supplementalTypeId.value)
    ) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:badType", {
          cause: this._badTypeCauseFormat[3],
          action: this._badTypeActionFormat[3],
          primaryId: parentId,
          property: propName,
          secondaryId: elementId,
          value: typestring
        })
      );
      return false;
    }

    if (supplementalTypeId !== undefined) {
      const supplementalTypeInfo = mapOfInDTMIToSupplementalTypeInfo.get(supplementalTypeId.value);
      if (supplementalTypeInfo?.isAbstract) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:abstractSupplementalType", {
            cause: `{primaryId:p} has @type that specifies supplemental type {value} that is abstract.`,
            action: `Remove @type {value} or replace with a concrete subtype of {value}.`,
            primaryId: elementId,
            property: "@type",
            value: AggregateContext.getTermOrUri(supplementalTypeId.value)
          })
        );
      }

      switch ((supplementalTypeInfo as SupplementalTypeInfoImpl)?.extensionKind) {
        case ExtensionKind.LATENTTYPE:
          elementInfo.ref = new LatentTypeInfoImpl(
            3,
            elementId,
            parentId,
            definedIn,
            "latenttype",
            LatentTypeInfoParser
          );
          (elementInfo.ref as LatentTypeInfoImpl).addType(
            supplementalTypeId.value,
            supplementalTypeInfo
          );
          materialKinds.push("latenttype");
          return true;
        case ExtensionKind.NAMEDLATENTTYPE:
          elementInfo.ref = new NamedLatentTypeInfoImpl(
            3,
            elementId,
            parentId,
            definedIn,
            "namedlatenttype",
            NamedLatentTypeInfoParser
          );
          (elementInfo.ref as NamedLatentTypeInfoImpl).addType(
            supplementalTypeId.value,
            supplementalTypeInfo
          );
          materialKinds.push("namedlatenttype");
          return true;
        case ExtensionKind.UNIT:
          elementInfo.ref = new UnitInfoImpl(
            3,
            elementId,
            parentId,
            definedIn,
            "unit",
            UnitInfoParser
          );
          (elementInfo.ref as UnitInfoImpl).addType(supplementalTypeId.value, supplementalTypeInfo);
          materialKinds.push("unit");
          return true;
        case ExtensionKind.UNITATTRIBUTE:
          elementInfo.ref = new UnitAttributeInfoImpl(
            3,
            elementId,
            parentId,
            definedIn,
            "unitattribute",
            UnitAttributeInfoParser
          );
          (elementInfo.ref as UnitAttributeInfoImpl).addType(
            supplementalTypeId.value,
            supplementalTypeInfo
          );
          materialKinds.push("unitattribute");
          return true;
      }

      supplementalTypeIds.push(supplementalTypeId.value);
      return true;
    }

    return true;
  }

  static parsePropertiesV3(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    elementInfo: EntityInfoImpl,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: { [index: string]: any },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    allowIdReferenceSyntax: boolean
  ): void {
    elementInfo.languageVersion = 3;

    for (const propKey in object) {
      const propValue = object[propKey];
      if (propValue === undefined || propValue === null) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:propertyValueNull", {
            cause: `{primaryId:p} property '{property}' has value null, which is not allowed in DTDL models.`,
            action: `Change the value of '{property}' to a value that is legal for this property.`,
            primaryId: elementInfo.id,
            property: propKey
          })
        );
        continue;
      }

      if (propKey[0] === "@") {
        continue;
      }

      switch (propKey) {
        case "comment":
        case "dtmi:dtdl:property:comment;3":
          elementInfo.comment = ValueParser.parseSingularStringToken(
            elementInfo.id,
            "comment",
            propValue,
            512,
            undefined,
            parsingErrors
          );
          continue;
        case "description":
        case "dtmi:dtdl:property:description;3":
          elementInfo.description = ValueParser.parseLangStringToken(
            elementInfo.id,
            "description",
            propValue,
            "en",
            512,
            undefined,
            parsingErrors
          );
          continue;
        case "displayName":
        case "dtmi:dtdl:property:displayName;3":
          elementInfo.displayName = ValueParser.parseLangStringToken(
            elementInfo.id,
            "displayName",
            propValue,
            "en",
            64,
            undefined,
            parsingErrors
          );
          continue;
      }

      if (elementInfo.undefinedTypes !== undefined && elementInfo.undefinedTypes.length > 0) {
        elementInfo.undefinedProperties[propKey] = propValue;
      } else {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:noTypeThatAllows", {
            cause: `{primaryId:p} does not have a @type that allows property ${propKey}.`,
            action: `Remove property ${propKey} or correct if misspelled.`,
            primaryId: elementInfo.id,
            property: propKey
          })
        );
      }
    }

    for (const supplementalType of elementInfo.supplementalTypes) {
      (supplementalType as SupplementalTypeInfoImpl).checkForRequiredProperties(
        parsingErrors,
        elementInfo.id,
        elementInfo.supplementalProperties
      );
    }
  }

  static parseToken(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    valueConstraints: ValueConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    token: any,
    parentId: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    propName: string | undefined,
    dtmiSeg: string | undefined,
    keyProp: string | undefined,
    idRequired: boolean,
    typeRequired: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    allowIdReferenceSyntax: boolean,
    allowedVersions: Set<number>
  ): number {
    let valueCount = 0;
    if (typeof token === "string") {
      if (parentId !== undefined) {
        this.parseIdString(
          objectPropertyInfoList,
          elementPropertyConstraints,
          valueConstraints,
          aggregateContext,
          parsingErrors,
          token.toString(),
          parentId,
          propName,
          keyProp,
          allowedVersions
        );
        valueCount++;
      }
    } else if (Array.isArray(token)) {
      for (const elementToken of token) {
        valueCount += this.parseToken(
          model,
          objectPropertyInfoList,
          elementPropertyConstraints,
          valueConstraints,
          aggregateContext,
          parsingErrors,
          elementToken,
          parentId,
          definedIn,
          propName,
          dtmiSeg,
          keyProp,
          idRequired,
          typeRequired,
          allowIdReferenceSyntax,
          allowedVersions
        );
      }
    } else if (typeof token === "object") {
      this.parseObject(
        model,
        objectPropertyInfoList,
        elementPropertyConstraints,
        valueConstraints,
        aggregateContext,
        parsingErrors,
        token,
        parentId,
        definedIn,
        propName,
        dtmiSeg,
        keyProp,
        idRequired,
        typeRequired,
        allowIdReferenceSyntax,
        allowedVersions
      );
      valueCount++;
    } else {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:badDtmiOrTerm", {
          cause: `{primaryId:p} property '{property}' has value '{value}' that is not a DTMI or a DTDL term.`,
          action: `Replace the value of property '{property}, with a valid DTMI or a term defined by DTDL -- see https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL.`,
          primaryId: parentId,
          property: propName,
          value: token.toString()
        })
      );
    }

    return valueCount;
  }

  static parseIdString(
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    valueConstraints: ValueConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    idString: string,
    parentId: string,
    propName: string | undefined,
    keyProp: string | undefined,
    allowedVersions: Set<number>
  ): void {
    const elementId = aggregateContext.createDtmi(idString);
    if (elementId !== undefined) {
      const objectPropertyInfo = {
        elementId: parentId,
        propertyName: propName ?? "",
        referencedElementId: elementId.value,
        keyProperty: keyProp,
        expectedKinds: this._concreteKinds[aggregateContext.dtdlVersion],
        allowedVersions: allowedVersions,
        badTypeCauseFormat: this._badTypeCauseFormat[aggregateContext.dtdlVersion],
        badTypeActionFormat: this._badTypeActionFormat[aggregateContext.dtdlVersion]
      };
      objectPropertyInfoList.push(objectPropertyInfo);
      if (valueConstraints !== null && elementPropertyConstraints !== null) {
        for (const vc of valueConstraints) {
          const elementPropertyConstraint = {
            parentId: parentId,
            propertyName: propName ?? "",
            elementId: elementId.value,
            valueConstraint: vc
          };
          elementPropertyConstraints.push(elementPropertyConstraint);
        }
      }
    } else {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:badDtmiOrTerm", {
          cause: `{primaryId:p} property '{property}' has value '{value}' that is not a DTMI or a DTDL term.`,
          action: `Replace the value of property '{property}, with a valid DTMI or a term defined by DTDL -- see https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL.`,
          primaryId: parentId,
          property: propName,
          value: idString
        })
      );
    }
  }
}

EntityInfoParser.initialize();
