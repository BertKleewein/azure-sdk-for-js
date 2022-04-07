// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { InterfaceInfoImpl } from "./interfaceInfoImpl";
import { InterfaceInfo } from "./interfaceInfo";
import { InterfaceKinds } from "./interfaceKinds";
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
import { MaterialTypeNameCollection } from "./materialTypeNameCollection";
import { ExtensionKind } from "./extensionKind";
import { ValueParser } from "./valueParser";
import { ParserCollection } from "./parserCollection";
export class InterfaceInfoParser {
  protected static _concreteKinds: { [x: number]: InterfaceKinds[] };
  protected static _badTypeActionFormat: { [x: number]: string };
  protected static _badTypeCauseFormat: { [x: number]: string };

  public static initialize(): void {
    this._concreteKinds = {};
    this._concreteKinds[2] = [];
    this._concreteKinds[2].push("interface");
    this._concreteKinds[3] = [];
    this._concreteKinds[3].push("interface");
    this._badTypeActionFormat = {};
    this._badTypeCauseFormat = {};
    this._badTypeActionFormat[2] = `Provide a value for property '{property}' with @type Interface.`;
    this._badTypeActionFormat[3] = `Provide a value for property '{property}' with @type Interface.`;
    this._badTypeCauseFormat[2] = `{primaryId:p} property '{property}' has value{secondaryId:e} that does not have @type of Interface.`;
    this._badTypeCauseFormat[3] = `{primaryId:p} property '{property}' has value{secondaryId:e} that does not have @type of Interface.`;
  }

  public static tryParseSupplementalProperty(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    elementInfo: InterfaceInfoImpl,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    propName: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

  public static parseObject(
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
    // This is a method to parse the object read from DTDL into a type of InterfaceInfo
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
      typeTokenArr = ["Interface"];
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
    ) as InterfaceInfoImpl;
    if (elementInfo === undefined) {
      return;
    }

    elementInfo.sourceObject = object;
    switch (childAggregateContext.dtdlVersion) {
      case 2: {
        if (elementInfo.parserClass?.parsePropertiesV2 !== undefined) {
          elementInfo.parserClass?.parsePropertiesV2(
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
        }

        break;
      }

      case 3: {
        if (elementInfo.parserClass?.parsePropertiesV3 !== undefined) {
          elementInfo.parserClass?.parsePropertiesV3(
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
        }

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

  private static parseTypeArray(
    tokenArr: any[],
    elementId: string,
    parentId: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    propName: string | undefined,
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[]
  ): InterfaceInfo | undefined {
    const materialKinds: EntityKinds[] = [];
    const elementInfo: Reference<InterfaceInfo> = referenceInit<InterfaceInfo>();
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
          (elementInfo.ref as InterfaceInfoImpl).addType(supplementalTypeId, supplementalTypeInfo);
        }
      }
    }

    return elementInfo.ref;
    // this ends the method.
  }

  private static tryParseTypeStringV2(
    typestring: string,
    elementId: string,
    parentId: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    propName: string | undefined,
    materialKinds: EntityKinds[],
    supplementalTypeIds: string[],
    elementInfo: Reference<InterfaceInfo>,
    undefinedTypes: string[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[]
  ): boolean {
    switch (typestring) {
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

        elementInfo.ref = new InterfaceInfoImpl(2, elementId, parentId, definedIn, "interface");
        materialKinds.push("interface");
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

  public static parsePropertiesV2(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    elementInfoAsAny: any,
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
    const elementInfo: InterfaceInfoImpl = elementInfoAsAny as InterfaceInfoImpl;

    elementInfo.languageVersion = 2;

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
        case "contents":
        case "dtmi:dtdl:property:contents;2":
          valueCount = ParserCollection.ContentInfoParser.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._contentsValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            elementInfo.id,
            "contents",
            "name",
            "name",
            false,
            true,
            allowIdReferenceSyntax,
            elementInfo._contentsAllowedVersionsV2
          );
          if (valueCount > 300) {
            parsingErrors.push(
              createParsingError("dtmi:dtdl:parsingError:propertyCountAboveMax", {
                cause: `{primaryId:p} property 'contents' has value valueCount values, but the allowed maximum count is 300`,
                action: `Remove one or more 'contents' to the object until the maximum count is satisfied.`,
                primaryId: elementInfo.id,
                property: "contents"
              })
            );
          }

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
        case "extends":
        case "dtmi:dtdl:property:extends;2":
          valueCount = ParserCollection.InterfaceInfoParser.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._extendsValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            elementInfo.id,
            "extends",
            undefined,
            undefined,
            true,
            true,
            allowIdReferenceSyntax,
            elementInfo._extendsAllowedVersionsV2
          );
          if (valueCount > 2) {
            parsingErrors.push(
              createParsingError("dtmi:dtdl:parsingError:propertyCountAboveMax", {
                cause: `{primaryId:p} property 'extends' has value valueCount values, but the allowed maximum count is 2`,
                action: `Remove one or more 'extends' to the object until the maximum count is satisfied.`,
                primaryId: elementInfo.id,
                property: "extends"
              })
            );
          }

          continue;
        case "schemas":
        case "dtmi:dtdl:property:schemas;2":
          ParserCollection.ComplexSchemaInfoParser.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._schemasValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            elementInfo.id,
            "schemas",
            undefined,
            undefined,
            true,
            true,
            allowIdReferenceSyntax,
            elementInfo._schemasAllowedVersionsV2
          );
          continue;
      }

      if (
        InterfaceInfoParser.tryParseSupplementalProperty(
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

    for (const supplementalType of elementInfo.supplementalTypes) {
      (supplementalType as SupplementalTypeInfoImpl).checkForRequiredProperties(
        parsingErrors,
        elementInfo.id,
        elementInfo.supplementalProperties
      );
    }
  }

  private static tryParseTypeStringV3(
    typestring: string,
    elementId: string,
    parentId: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    definedIn: string | undefined,
    propName: string | undefined,
    materialKinds: EntityKinds[],
    supplementalTypeIds: string[],
    elementInfo: Reference<InterfaceInfo>,
    undefinedTypes: string[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[]
  ): boolean {
    switch (typestring) {
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

        elementInfo.ref = new InterfaceInfoImpl(3, elementId, parentId, definedIn, "interface");
        materialKinds.push("interface");
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

  public static parsePropertiesV3(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    elementInfoAsAny: any,
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
    const elementInfo: InterfaceInfoImpl = elementInfoAsAny as InterfaceInfoImpl;

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
        case "contents":
        case "dtmi:dtdl:property:contents;3":
          ParserCollection.ContentInfoParser.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._contentsValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            elementInfo.id,
            "contents",
            "name",
            "name",
            false,
            true,
            allowIdReferenceSyntax,
            elementInfo._contentsAllowedVersionsV3
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
        case "extends":
        case "dtmi:dtdl:property:extends;3":
          ParserCollection.InterfaceInfoParser.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._extendsValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            elementInfo.id,
            "extends",
            undefined,
            undefined,
            true,
            true,
            allowIdReferenceSyntax,
            elementInfo._extendsAllowedVersionsV3
          );
          continue;
        case "schemas":
        case "dtmi:dtdl:property:schemas;3":
          ParserCollection.ComplexSchemaInfoParser.parseToken(
            model,
            objectPropertyInfoList,
            elementPropertyConstraints,
            elementInfo._schemasValueConstraints,
            aggregateContext,
            parsingErrors,
            propValue,
            elementInfo.id,
            elementInfo.id,
            "schemas",
            undefined,
            undefined,
            true,
            true,
            allowIdReferenceSyntax,
            elementInfo._schemasAllowedVersionsV3
          );
          continue;
      }

      if (
        InterfaceInfoParser.tryParseSupplementalProperty(
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

    for (const supplementalType of elementInfo.supplementalTypes) {
      (supplementalType as SupplementalTypeInfoImpl).checkForRequiredProperties(
        parsingErrors,
        elementInfo.id,
        elementInfo.supplementalProperties
      );
    }
  }

  public static parseToken(
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

  private static parseIdString(
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
