// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { SupplementalTypeInfoImpl } from "./supplementalTypeInfoImpl";
import { ReferenceInfoImpl } from "./referenceInfoImpl";
import { ReferenceInfo } from "./referenceInfo";
import { ReferenceKinds } from "./referenceKinds";
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
export class ReferenceInfoParser {
  protected static _concreteKinds: { [x: number]: ReferenceKinds[] };
  protected static _badTypeActionFormat: { [x: number]: string };
  protected static _badTypeCauseFormat: { [x: number]: string };

  public static initialize(): void {
    this._concreteKinds = {};
    this._badTypeActionFormat = {};
    this._badTypeCauseFormat = {};
  }

  public static tryParseSupplementalProperty(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    elementInfo: ReferenceInfoImpl,
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
    // This is a method to parse the object read from DTDL into a type of ReferenceInfo
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
      typeTokenArr = ["Reference"];
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
    ) as ReferenceInfoImpl;
    if (elementInfo === undefined) {
      return;
    }

    elementInfo.sourceObject = object;
    switch (childAggregateContext.dtdlVersion) {
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
  ): ReferenceInfo | undefined {
    const materialKinds: EntityKinds[] = [];
    const elementInfo: Reference<ReferenceInfo> = referenceInit<ReferenceInfo>();
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
          (elementInfo.ref as ReferenceInfoImpl).addType(supplementalTypeId, supplementalTypeInfo);
        }
      }
    }

    return elementInfo.ref;
    // this ends the method.
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
