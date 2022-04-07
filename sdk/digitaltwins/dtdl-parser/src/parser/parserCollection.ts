// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { Parser } from "./parser";
/**
 * A collection of all static ParserObjects.
 * The properties on this object are populated at runtime as the parsers are loaded.
 * We do this to avoid circular dependencies.
 **/
export class ParserCollection {
  public static ArrayInfoParser: Parser;
  public static BooleanInfoParser: Parser;
  public static CommandInfoParser: Parser;
  public static CommandPayloadInfoParser: Parser;
  public static CommandTypeInfoParser: Parser;
  public static ComplexSchemaInfoParser: Parser;
  public static ComponentInfoParser: Parser;
  public static ContentInfoParser: Parser;
  public static DateInfoParser: Parser;
  public static DateTimeInfoParser: Parser;
  public static DoubleInfoParser: Parser;
  public static DurationInfoParser: Parser;
  public static EntityInfoParser: Parser;
  public static EnumInfoParser: Parser;
  public static EnumValueInfoParser: Parser;
  public static FieldInfoParser: Parser;
  public static FloatInfoParser: Parser;
  public static IntegerInfoParser: Parser;
  public static InterfaceInfoParser: Parser;
  public static LongInfoParser: Parser;
  public static MapInfoParser: Parser;
  public static MapKeyInfoParser: Parser;
  public static MapValueInfoParser: Parser;
  public static NamedEntityInfoParser: Parser;
  public static NumericSchemaInfoParser: Parser;
  public static ObjectInfoParser: Parser;
  public static PrimitiveSchemaInfoParser: Parser;
  public static PropertyInfoParser: Parser;
  public static RelationshipInfoParser: Parser;
  public static SchemaInfoParser: Parser;
  public static SchemaFieldInfoParser: Parser;
  public static StringInfoParser: Parser;
  public static TelemetryInfoParser: Parser;
  public static TemporalSchemaInfoParser: Parser;
  public static TimeInfoParser: Parser;
  public static UnitInfoParser: Parser;
  public static UnitAttributeInfoParser: Parser;
  public static CommandRequestInfoParser: Parser;
  public static CommandResponseInfoParser: Parser;
  public static LatentTypeInfoParser: Parser;
  public static NamedLatentTypeInfoParser: Parser;
  public static ReferenceInfoParser: Parser;
}
