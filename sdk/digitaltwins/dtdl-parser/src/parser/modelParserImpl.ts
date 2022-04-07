// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { DtmiResolver } from "./type";
import { ElementPropertyConstraint } from "./type";
import { ModelParsingOption } from "./enum";
import { ParsingError } from "./parsingError";
import { createParsingError } from "./parsingErrorImpl";
import { ResolutionError } from "./resolutionError";
import { JsonSyntaxError } from "./jsonSyntaxError";
import { ParsingException } from "./parsingException";
import { AggregateContext } from "./aggregateContext";
import { Model } from "./model";
import { ModelDict } from "./modelDict";
import { ModelParser } from "./modelParser";
import { ParsedObjectPropertyInfo } from "./parsedObjectPropertyInfo";
import { PartitionTypeCollection } from "./partitionTypeCollection";
import { StandardElements } from "./standardElements";
import { RootableTypeCollection } from "./rootableTypeCollection";
import { ModelParserStatic } from "./modelParserStatic";
import { TypeChecker } from "./type";
/**
 * Class for parsing the DTDL langauge.
 **/
export class ModelParserImpl implements ModelParser {
  constructor() {
    // codegen-outline-begin constructor
    this.options = ModelParsingOption.None;
    // codegen-outline-end
  }

  // codegen-outline-begin fields
  static graphKeyword = "@graph";
  static idKeyword = "@id";
  // codegen-outline-end

  // codegen-outline-begin methods
  getModels?: DtmiResolver;
  options: ModelParsingOption;
  maxDtdlVersion?: number;

  async parse(jsonTexts: string[]): Promise<ModelDict> {
    if (
      (this.options & ModelParsingOption.MandateTopLevelPartition) !== 0 &&
      (this.options & ModelParsingOption.PermitAnyTopLevelElement) !== 0
    ) {
      throw new Error(
        "Options MandateTopLevelPartition and PermitAnyTopLevelElement are both specfied but are incompatible."
      );
    }

    const model = new Model();
    const objectPropertyInfoList: ParsedObjectPropertyInfo[] = [];
    const elementPropertyConstraints: ElementPropertyConstraint[] = [];
    const parsingErrors: ParsingError[] = [];

    await this._parseAndResolveAsNeeded(
      jsonTexts,
      model,
      objectPropertyInfoList,
      elementPropertyConstraints,
      parsingErrors
    );

    model.setObjectProperties(objectPropertyInfoList, parsingErrors);

    for (const elementPropertyConstraint of elementPropertyConstraints) {
      const typeChecker = model.dict[elementPropertyConstraint.elementId];
      if (
        elementPropertyConstraint.valueConstraint.requiredTypes !== undefined &&
        !elementPropertyConstraint.valueConstraint.requiredTypes.some((t) =>
          (typeChecker as TypeChecker)?.doesHaveType(t)
        )
      ) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:badType", {
            cause: `{primaryId:p} property '{property}' has value {secondaryId} that does not have @type of {value}.`,
            action: `Provide a value for property '{ property }' that has an @type of {value} or a subtype thereof.`,
            primaryId: elementPropertyConstraint.parentId,
            property: elementPropertyConstraint.propertyName,
            secondaryId: elementPropertyConstraint.elementId,
            value: elementPropertyConstraint.valueConstraint.requiredTypesString
          })
        );
      }

      if (
        elementPropertyConstraint.valueConstraint.requiredValues !== undefined &&
        !elementPropertyConstraint.valueConstraint.requiredValues.includes(
          elementPropertyConstraint.elementId
        )
      ) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:badValue", {
            cause: `{primaryId:p} property '{property}' has value {secondaryId} that is not {value}.`,
            action: `Change the value of property '{property}' to {value}.`,
            primaryId: elementPropertyConstraint.parentId,
            property: elementPropertyConstraint.propertyName,
            secondaryId: elementPropertyConstraint.elementId,
            value: elementPropertyConstraint.valueConstraint.requiredValuesString
          })
        );
      }
    }

    for (const element of Object.values(model.dict)) {
      (element as any).applyTransformations(model, parsingErrors);
    }

    for (const element of Object.values(model.dict)) {
      (element as any).checkRestrictions(parsingErrors);
    }

    if (parsingErrors.length > 0) {
      throw new ParsingException(parsingErrors);
    }

    return model.dict;
  }

  private async _parseAndResolveAsNeeded(
    jsonTexts: string[],
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    parsingErrors: ParsingError[]
  ): Promise<void> {
    this._parseTextsIntoModel(
      jsonTexts,
      model,
      objectPropertyInfoList,
      elementPropertyConstraints,
      parsingErrors
    );
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const undefinedIdentifierSet = new Set<string>();

      for (const objectPropertyInfo of objectPropertyInfoList) {
        if (!model.hasElementWithId(objectPropertyInfo.referencedElementId)) {
          if (
            !StandardElements.tryAddElementToModel(model, objectPropertyInfo.referencedElementId)
          ) {
            undefinedIdentifierSet.add(objectPropertyInfo.referencedElementId);
          }
        }
      }

      const undefinedIdentifiers = Array.from(undefinedIdentifierSet.values());
      if (undefinedIdentifiers.length === 0) {
        return;
      }

      if (this.getModels === undefined) {
        throw new ResolutionError(
          "No getModels provided to resolve requisite reference(s): " +
            undefinedIdentifiers.join(" "),
          undefinedIdentifiers
        );
      }

      const dependencyMapping = await this.getModels(undefinedIdentifiers, {
        dependencyResolution: "enabled"
      });

      const additionalJsonTexts =
        dependencyMapping && Object.values(dependencyMapping).map((value) => JSON.stringify(value));
      if (additionalJsonTexts === null) {
        throw new ResolutionError(
          "getModels refused to resolve requisite references to element(s): " +
            undefinedIdentifiers.join(" "),
          undefinedIdentifiers
        );
      }

      this._parseTextsIntoModel(
        additionalJsonTexts,
        model,
        objectPropertyInfoList,
        elementPropertyConstraints,
        parsingErrors
      );

      const stillUnresolvedIdentifierSet = new Set<string>();
      for (const undefinedId of undefinedIdentifiers) {
        if (!model.hasElementWithId(undefinedId)) {
          stillUnresolvedIdentifierSet.add(undefinedId);
        }
      }

      const stillUnresolvedIdentifiers = Array.from(stillUnresolvedIdentifierSet.values());
      if (stillUnresolvedIdentifiers.length > 0) {
        throw new ResolutionError(
          "getModels failed to resolve requisite references to element(s): " +
            stillUnresolvedIdentifiers.join(" "),
          stillUnresolvedIdentifiers
        );
      }
    }
  }

  private _parseTextsIntoModel(
    jsonTexts: string[],
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    parsingErrors: ParsingError[]
  ): void {
    jsonTexts.forEach((jsonText: string, index: number) => {
      let documentToken: any;
      try {
        documentToken = JSON.parse(jsonText);
      } catch (error) {
        throw new JsonSyntaxError(error as Error, index);
      }

      this._parseToken(
        model,
        objectPropertyInfoList,
        elementPropertyConstraints,
        parsingErrors,
        documentToken,
        0
      );
      if (parsingErrors.length > 0) {
        throw new ParsingException(parsingErrors);
      }
    });
  }

  private _parseToken(
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    parsingErrors: ParsingError[],
    token: any,
    dtdlVersion: number
  ): void {
    if (Array.isArray(token)) {
      for (const subToken of token) {
        this._parseToken(
          model,
          objectPropertyInfoList,
          elementPropertyConstraints,
          parsingErrors,
          subToken,
          dtdlVersion
        );
      }
      return;
    }

    if (typeof token !== "object") {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:notJsonObject", {
          cause: `Top-level JSON element is neither a JSON object nor a JSON array of JSON objects.`,
          action: `Update your model to follow the examples in https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL.`
        })
      );
      throw new ParsingException(parsingErrors);
    }

    const obj = token as { [prop: string]: string };

    const aggregateContext = new AggregateContext(
      (this.options & ModelParsingOption.RejectUndefinedExtensions) !== 0,
      (this.options & ModelParsingOption.RejectNonDtmiContexts) !== 0,
      this.maxDtdlVersion
    ).getChildContext(obj, parsingErrors);

    if (Object.prototype.hasOwnProperty.call(obj, ModelParserImpl.graphKeyword)) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:graphDisallowed", {
          cause: `Top-level JSON object contains '@graph' property, which is not allowed.`,
          action: `Remove the'@graph' property, and elevate the value of this property to the top level of the JSON document.`
        })
      );
      throw new ParsingException(parsingErrors);
    }

    if (!Object.prototype.hasOwnProperty.call(obj, ModelParserImpl.idKeyword)) {
      parsingErrors.push(
        createParsingError("dtmi:dtdl:parsingError:missingTopLevelId", {
          cause: `Top-level element requires an identifer but none provided.`,
          action: `Add an '@id' property whose value is a string that conforms to the DTMI syntax -- see https://github.com/Azure/digital-twin-model-identifier.`
        })
      );
      throw new ParsingException(parsingErrors);
    }

    if ((this.options & ModelParsingOption.MandateTopLevelPartition) !== 0) {
      if (!PartitionTypeCollection.hasPartitionType(obj)) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:badType", {
            cause: `Top-level element ${JSON.stringify(
              obj[ModelParserImpl.idKeyword]
            )} does not have @type of ${PartitionTypeCollection.partitionTypeDescription}.`,
            action: `Provide a @type in the set of allowable types.`
          })
        );
        throw new ParsingException(parsingErrors);
      }
    } else if ((this.options & ModelParsingOption.PermitAnyTopLevelElement) === 0) {
      if (!RootableTypeCollection.hasRootableType(obj, aggregateContext.dtdlVersion)) {
        parsingErrors.push(
          createParsingError("dtmi:dtdl:parsingError:badType", {
            cause: `Top-level element ${JSON.stringify(
              obj[ModelParserImpl.idKeyword]
            )} does not have @type of ${
              RootableTypeCollection.rootableTypeDescriptions[aggregateContext.dtdlVersion]
            }.`,
            action: `Provide a @type in the set of allowable types.`
          })
        );
        throw new ParsingException(parsingErrors);
      }
    }

    ModelParserStatic.parseObject(
      model,
      objectPropertyInfoList,
      elementPropertyConstraints,
      aggregateContext,
      parsingErrors,
      obj
    );
  }
  // codegen-outline-end
}
