// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { EnumInfoImpl } from "./enumInfoImpl";
import { EnumInfo } from "./enumInfo";
import { EnumKinds } from "./enumKinds";
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
import { ValueParser } from "./valueParser";
import { ValueConstraint } from "./type/valueConstraint";
import { SupplementalTypeInfoStatic } from "./supplementalTypeInfoStatic";
import { MaterialTypeNameCollection } from "./materialTypeNameCollection";
import { ModelParserStatic } from "./modelParserStatic";
import { ExtensionKind } from "./extensionKind";
import { EnumValueInfoImpl } from "./enumValueInfoImpl";
import { EnumValueInfoStatic } from "./enumValueInfoStatic";
import { PrimitiveSchemaInfoImpl } from "./primitiveSchemaInfoImpl";
import { PrimitiveSchemaInfoStatic } from "./primitiveSchemaInfoStatic";
export class EnumInfoStatic {
  protected static _concreteKinds: { [x: number]: EnumKinds[] };
  protected static _badTypeActionFormat: { [x: number]: string };
  protected static _badTypeCauseFormat: { [x: number]: string };

  static initialize() {
    this._concreteKinds = {};
    this._concreteKinds[2] = [];
    this._concreteKinds[2].push("enum");
    this._concreteKinds[3] = [];
    this._concreteKinds[3].push("enum");
    this._badTypeActionFormat = {};
    this._badTypeCauseFormat = {};
    this._badTypeActionFormat[2] = `Provide a value for property '{property}' with @type Enum.`;
    this._badTypeActionFormat[3] = `Provide a value for property '{property}' with @type Enum.`;
    this._badTypeCauseFormat[2] = `{primaryId:p} property '{property}' has value{secondaryId:e} that does not have @type of Enum.`;
    this._badTypeCauseFormat[3] = `{primaryId:p} property '{property}' has value{secondaryId:e} that does not have @type of Enum.`;
  }

  public static tryParseSupplementalProperty(
    model: Model,
    elementInfo: EnumInfoImpl,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    propName: string,
    propToken: any
  ): boolean {
    const propDtmi = aggregateContext.createDtmi(propName);
    if (propDtmi === undefined) {
      return false;
    }

    for (const supplementalType of elementInfo.supplementalTypes) {
      if (
        (supplementalType as SupplementalTypeInfoImpl).tryParseProperty(
          model,
          objectPropertyInfoList,
          elementPropertyConstraints,
          aggregateContext,
          parsingErrors,
          elementInfo.id,
          propDtmi.value,
          propToken,
          elementInfo.supplementalProperties
        )
      ) {
        return true;
      }
    }

    return false;
  }

  static parseObject(
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    valueConstraints: ValueConstraint[],
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: { [index: string]: any },
    parentId: string | undefined,
    definedIn: string | undefined,
    propName: string | undefined,
    dtmiSeg: string | undefined,
    keyProp: string | undefined,
    idRequired: boolean,
    typeRequired: boolean,
    allowIdReferenceSyntax: boolean,
    allowedVersions: Set<number>
  ): any {
    // This is a method to parse the object read from DTDL into a type of EnumInfo
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
      typeTokenArr = ["Enum"];
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
    ) as EnumInfoImpl;
    if (elementInfo === undefined) {
      return;
    }

    elementInfo.sourceObject = object;
    switch (childAggregateContext.dtdlVersion) {
      case 2: {
        elementInfo.staticObjectClass.parsePropertiesV2(
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
        elementInfo.staticObjectClass.parsePropertiesV3(
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
    definedIn: string | undefined,
    propName: string | undefined,
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[]
  ): EnumInfo | undefined {
    const materialKinds: EntityKinds[] = [];
    const elementInfo: Reference<EnumInfo> = referenceInit();
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
          (elementInfo.ref as EnumInfoImpl).addType(supplementalTypeId, supplementalTypeInfo);
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
    definedIn: string | undefined,
    propName: string | undefined,
    materialKinds: EntityKinds[],
    supplementalTypeIds: string[],
    elementInfo: Reference<EnumInfo>,
    undefinedTypes: string[],
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[]
  ): boolean {
    switch (typestring) {
      case "Enum":
      case "dtmi:dtdl:class:Enum;2":
        elementInfo.ref = new EnumInfoImpl(
          2,
          elementId,
          parentId,
          definedIn,
          "enum",
          EnumInfoStatic
        );
        materialKinds.push("enum");
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
          break;
        case ExtensionKind.UNITATTRIBUTE:
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
          break;
      }

      supplementalTypeIds.push(supplementalTypeId.value);
      return true;
    }

    return true;
  }

  static parsePropertiesV2(
    model: Model,
    elementInfo: EnumInfoImpl,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: { [index: string]: any },
    definedIn: string | undefined,
    allowIdReferenceSyntax: boolean
  ): void {
    elementInfo.languageVersion = 2;

    let valueSchemaPropertyMissing = true;
    for (const propKey in object) {
      let valueCount: number;
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
        case "enumValues":
        case "dtmi:dtdl:property:enumValues;2":
          valueCount = EnumValueInfoStatic.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._enumValuesValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            definedIn ?? elementInfo.id,
            "enumValues",
            "name",
            undefined,
            false,
            false,
            allowIdReferenceSyntax,
            elementInfo._enumValuesAllowedVersionsV2
          );
          if (valueCount < 1) {
            parsingErrors.push(
              createParsingError("dtmi:dtdl:parsingError:propertyCountBelowMin", {
                cause: `{primaryId:p} property 'enumValues' has value valueCount values, but the required minimum count is 1`,
                action: `Add one or more 'enumValues' to the object until the minimum count is satisfied.`,
                primaryId: elementInfo.id,
                property: "enumValues"
              })
            );
          }

          if (valueCount > 100) {
            parsingErrors.push(
              createParsingError("dtmi:dtdl:parsingError:propertyCountAboveMax", {
                cause: `{primaryId:p} property 'enumValues' has value valueCount values, but the allowed maximum count is 100`,
                action: `Remove one or more 'enumValues' to the object until the maximum count is satisfied.`,
                primaryId: elementInfo.id,
                property: "enumValues"
              })
            );
          }

          continue;
        case "valueSchema":
        case "dtmi:dtdl:property:valueSchema;2":
          valueSchemaPropertyMissing = false;
          valueCount = PrimitiveSchemaInfoStatic.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._valueSchemaValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            definedIn ?? elementInfo.id,
            "valueSchema",
            undefined,
            undefined,
            true,
            true,
            allowIdReferenceSyntax,
            elementInfo._valueSchemaAllowedVersionsV2
          );
          if (valueCount < 1) {
            parsingErrors.push(
              createParsingError("dtmi:dtdl:parsingError:propertyCountBelowMin", {
                cause: `{primaryId:p} property 'valueSchema' has value valueCount values, but the required minimum count is 1`,
                action: `Add one or more 'valueSchema' to the object until the minimum count is satisfied.`,
                primaryId: elementInfo.id,
                property: "valueSchema"
              })
            );
          }

          if (valueCount > 1) {
            parsingErrors.push(
              createParsingError("dtmi:dtdl:parsingError:propertyCountAboveMax", {
                cause: `{primaryId:p} property 'valueSchema' has value valueCount values, but the allowed maximum count is 1`,
                action: `Remove one or more 'valueSchema' to the object until the maximum count is satisfied.`,
                primaryId: elementInfo.id,
                property: "valueSchema"
              })
            );
          }

          continue;
      }

      if (
        EnumInfoStatic.tryParseSupplementalProperty(
          model,
          elementInfo,
          objectPropertyInfoList,
          elementPropertyConstraints,
          aggregateContext,
          parsingErrors,
          propKey,
          propValue
        )
      ) {
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

    if (valueSchemaPropertyMissing) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:missingRequiredProperty", {
          cause: "{primaryId:p} property valueSchema is required but missing.",
          action: "Add a valueSchema property to the object.",
          primaryId: elementInfo.id,
          property: "valueSchema"
        })
      );
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
    definedIn: string | undefined,
    propName: string | undefined,
    materialKinds: EntityKinds[],
    supplementalTypeIds: string[],
    elementInfo: Reference<EnumInfo>,
    undefinedTypes: string[],
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[]
  ): boolean {
    switch (typestring) {
      case "Enum":
      case "dtmi:dtdl:class:Enum;3":
        elementInfo.ref = new EnumInfoImpl(
          3,
          elementId,
          parentId,
          definedIn,
          "enum",
          EnumInfoStatic
        );
        materialKinds.push("enum");
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
          break;
        case ExtensionKind.NAMEDLATENTTYPE:
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
          break;
        case ExtensionKind.UNIT:
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
          break;
        case ExtensionKind.UNITATTRIBUTE:
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
          break;
      }

      supplementalTypeIds.push(supplementalTypeId.value);
      return true;
    }

    return true;
  }

  static parsePropertiesV3(
    model: Model,
    elementInfo: EnumInfoImpl,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: { [index: string]: any },
    definedIn: string | undefined,
    allowIdReferenceSyntax: boolean
  ): void {
    elementInfo.languageVersion = 3;

    let valueSchemaPropertyMissing = true;
    for (const propKey in object) {
      let valueCount: number;
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
        case "enumValues":
        case "dtmi:dtdl:property:enumValues;3":
          EnumValueInfoStatic.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._enumValuesValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            definedIn ?? elementInfo.id,
            "enumValues",
            "name",
            undefined,
            false,
            false,
            allowIdReferenceSyntax,
            elementInfo._enumValuesAllowedVersionsV3
          );
          continue;
        case "valueSchema":
        case "dtmi:dtdl:property:valueSchema;3":
          valueSchemaPropertyMissing = false;
          valueCount = PrimitiveSchemaInfoStatic.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._valueSchemaValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            definedIn ?? elementInfo.id,
            "valueSchema",
            undefined,
            undefined,
            true,
            true,
            allowIdReferenceSyntax,
            elementInfo._valueSchemaAllowedVersionsV3
          );
          if (valueCount < 1) {
            parsingErrors.push(
              createParsingError("dtmi:dtdl:parsingError:propertyCountBelowMin", {
                cause: `{primaryId:p} property 'valueSchema' has value valueCount values, but the required minimum count is 1`,
                action: `Add one or more 'valueSchema' to the object until the minimum count is satisfied.`,
                primaryId: elementInfo.id,
                property: "valueSchema"
              })
            );
          }

          if (valueCount > 1) {
            parsingErrors.push(
              createParsingError("dtmi:dtdl:parsingError:propertyCountAboveMax", {
                cause: `{primaryId:p} property 'valueSchema' has value valueCount values, but the allowed maximum count is 1`,
                action: `Remove one or more 'valueSchema' to the object until the maximum count is satisfied.`,
                primaryId: elementInfo.id,
                property: "valueSchema"
              })
            );
          }

          continue;
      }

      if (
        EnumInfoStatic.tryParseSupplementalProperty(
          model,
          elementInfo,
          objectPropertyInfoList,
          elementPropertyConstraints,
          aggregateContext,
          parsingErrors,
          propKey,
          propValue
        )
      ) {
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

    if (valueSchemaPropertyMissing) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:missingRequiredProperty", {
          cause: "{primaryId:p} property valueSchema is required but missing.",
          action: "Add a valueSchema property to the object.",
          primaryId: elementInfo.id,
          property: "valueSchema"
        })
      );
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
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    valueConstraints: ValueConstraint[],
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    token: any,
    parentId: string | undefined,
    definedIn: string | undefined,
    propName: string | undefined,
    dtmiSeg: string | undefined,
    keyProp: string | undefined,
    idRequired: boolean,
    typeRequired: boolean,
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

EnumInfoStatic.initialize();
