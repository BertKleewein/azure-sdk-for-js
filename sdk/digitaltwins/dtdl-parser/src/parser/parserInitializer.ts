// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { ParserCollection } from "./parserCollection";
import { ArrayInfoParser } from "./arrayInfoParser";
import { BooleanInfoParser } from "./booleanInfoParser";
import { CommandInfoParser } from "./commandInfoParser";
import { CommandPayloadInfoParser } from "./commandPayloadInfoParser";
import { CommandTypeInfoParser } from "./commandTypeInfoParser";
import { ComplexSchemaInfoParser } from "./complexSchemaInfoParser";
import { ComponentInfoParser } from "./componentInfoParser";
import { ContentInfoParser } from "./contentInfoParser";
import { DateInfoParser } from "./dateInfoParser";
import { DateTimeInfoParser } from "./dateTimeInfoParser";
import { DoubleInfoParser } from "./doubleInfoParser";
import { DurationInfoParser } from "./durationInfoParser";
import { EntityInfoParser } from "./entityInfoParser";
import { EnumInfoParser } from "./enumInfoParser";
import { EnumValueInfoParser } from "./enumValueInfoParser";
import { FieldInfoParser } from "./fieldInfoParser";
import { FloatInfoParser } from "./floatInfoParser";
import { IntegerInfoParser } from "./integerInfoParser";
import { InterfaceInfoParser } from "./interfaceInfoParser";
import { LongInfoParser } from "./longInfoParser";
import { MapInfoParser } from "./mapInfoParser";
import { MapKeyInfoParser } from "./mapKeyInfoParser";
import { MapValueInfoParser } from "./mapValueInfoParser";
import { NamedEntityInfoParser } from "./namedEntityInfoParser";
import { NumericSchemaInfoParser } from "./numericSchemaInfoParser";
import { ObjectInfoParser } from "./objectInfoParser";
import { PrimitiveSchemaInfoParser } from "./primitiveSchemaInfoParser";
import { PropertyInfoParser } from "./propertyInfoParser";
import { RelationshipInfoParser } from "./relationshipInfoParser";
import { SchemaInfoParser } from "./schemaInfoParser";
import { SchemaFieldInfoParser } from "./schemaFieldInfoParser";
import { StringInfoParser } from "./stringInfoParser";
import { TelemetryInfoParser } from "./telemetryInfoParser";
import { TemporalSchemaInfoParser } from "./temporalSchemaInfoParser";
import { TimeInfoParser } from "./timeInfoParser";
import { UnitInfoParser } from "./unitInfoParser";
import { UnitAttributeInfoParser } from "./unitAttributeInfoParser";
import { CommandRequestInfoParser } from "./commandRequestInfoParser";
import { CommandResponseInfoParser } from "./commandResponseInfoParser";
import { LatentTypeInfoParser } from "./latentTypeInfoParser";
import { NamedLatentTypeInfoParser } from "./namedLatentTypeInfoParser";
import { ReferenceInfoParser } from "./referenceInfoParser";
import { ArrayInfoImpl } from "./arrayInfoImpl";
import { BooleanInfoImpl } from "./booleanInfoImpl";
import { CommandInfoImpl } from "./commandInfoImpl";
import { CommandPayloadInfoImpl } from "./commandPayloadInfoImpl";
import { CommandTypeInfoImpl } from "./commandTypeInfoImpl";
import { ComplexSchemaInfoImpl } from "./complexSchemaInfoImpl";
import { ComponentInfoImpl } from "./componentInfoImpl";
import { ContentInfoImpl } from "./contentInfoImpl";
import { DateInfoImpl } from "./dateInfoImpl";
import { DateTimeInfoImpl } from "./dateTimeInfoImpl";
import { DoubleInfoImpl } from "./doubleInfoImpl";
import { DurationInfoImpl } from "./durationInfoImpl";
import { EntityInfoImpl } from "./entityInfoImpl";
import { EnumInfoImpl } from "./enumInfoImpl";
import { EnumValueInfoImpl } from "./enumValueInfoImpl";
import { FieldInfoImpl } from "./fieldInfoImpl";
import { FloatInfoImpl } from "./floatInfoImpl";
import { IntegerInfoImpl } from "./integerInfoImpl";
import { InterfaceInfoImpl } from "./interfaceInfoImpl";
import { LongInfoImpl } from "./longInfoImpl";
import { MapInfoImpl } from "./mapInfoImpl";
import { MapKeyInfoImpl } from "./mapKeyInfoImpl";
import { MapValueInfoImpl } from "./mapValueInfoImpl";
import { NamedEntityInfoImpl } from "./namedEntityInfoImpl";
import { NumericSchemaInfoImpl } from "./numericSchemaInfoImpl";
import { ObjectInfoImpl } from "./objectInfoImpl";
import { PrimitiveSchemaInfoImpl } from "./primitiveSchemaInfoImpl";
import { PropertyInfoImpl } from "./propertyInfoImpl";
import { RelationshipInfoImpl } from "./relationshipInfoImpl";
import { SchemaInfoImpl } from "./schemaInfoImpl";
import { SchemaFieldInfoImpl } from "./schemaFieldInfoImpl";
import { StringInfoImpl } from "./stringInfoImpl";
import { TelemetryInfoImpl } from "./telemetryInfoImpl";
import { TemporalSchemaInfoImpl } from "./temporalSchemaInfoImpl";
import { TimeInfoImpl } from "./timeInfoImpl";
import { UnitInfoImpl } from "./unitInfoImpl";
import { UnitAttributeInfoImpl } from "./unitAttributeInfoImpl";
import { CommandRequestInfoImpl } from "./commandRequestInfoImpl";
import { CommandResponseInfoImpl } from "./commandResponseInfoImpl";
import { LatentTypeInfoImpl } from "./latentTypeInfoImpl";
import { NamedLatentTypeInfoImpl } from "./namedLatentTypeInfoImpl";
import { ReferenceInfoImpl } from "./referenceInfoImpl";
import { StandardElements } from "./standardElements";
/**
 * A class to initialize the parser objects at runtime
 **/
export class ParserInitializer {
  public static initialized?: boolean;

  public static initialize(): void {
    if (!this.initialized) {
      // Populate ParserCollection object

      ParserCollection.ArrayInfoParser = ArrayInfoParser;
      ParserCollection.BooleanInfoParser = BooleanInfoParser;
      ParserCollection.CommandInfoParser = CommandInfoParser;
      ParserCollection.CommandPayloadInfoParser = CommandPayloadInfoParser;
      ParserCollection.CommandTypeInfoParser = CommandTypeInfoParser;
      ParserCollection.ComplexSchemaInfoParser = ComplexSchemaInfoParser;
      ParserCollection.ComponentInfoParser = ComponentInfoParser;
      ParserCollection.ContentInfoParser = ContentInfoParser;
      ParserCollection.DateInfoParser = DateInfoParser;
      ParserCollection.DateTimeInfoParser = DateTimeInfoParser;
      ParserCollection.DoubleInfoParser = DoubleInfoParser;
      ParserCollection.DurationInfoParser = DurationInfoParser;
      ParserCollection.EntityInfoParser = EntityInfoParser;
      ParserCollection.EnumInfoParser = EnumInfoParser;
      ParserCollection.EnumValueInfoParser = EnumValueInfoParser;
      ParserCollection.FieldInfoParser = FieldInfoParser;
      ParserCollection.FloatInfoParser = FloatInfoParser;
      ParserCollection.IntegerInfoParser = IntegerInfoParser;
      ParserCollection.InterfaceInfoParser = InterfaceInfoParser;
      ParserCollection.LongInfoParser = LongInfoParser;
      ParserCollection.MapInfoParser = MapInfoParser;
      ParserCollection.MapKeyInfoParser = MapKeyInfoParser;
      ParserCollection.MapValueInfoParser = MapValueInfoParser;
      ParserCollection.NamedEntityInfoParser = NamedEntityInfoParser;
      ParserCollection.NumericSchemaInfoParser = NumericSchemaInfoParser;
      ParserCollection.ObjectInfoParser = ObjectInfoParser;
      ParserCollection.PrimitiveSchemaInfoParser = PrimitiveSchemaInfoParser;
      ParserCollection.PropertyInfoParser = PropertyInfoParser;
      ParserCollection.RelationshipInfoParser = RelationshipInfoParser;
      ParserCollection.SchemaInfoParser = SchemaInfoParser;
      ParserCollection.SchemaFieldInfoParser = SchemaFieldInfoParser;
      ParserCollection.StringInfoParser = StringInfoParser;
      ParserCollection.TelemetryInfoParser = TelemetryInfoParser;
      ParserCollection.TemporalSchemaInfoParser = TemporalSchemaInfoParser;
      ParserCollection.TimeInfoParser = TimeInfoParser;
      ParserCollection.UnitInfoParser = UnitInfoParser;
      ParserCollection.UnitAttributeInfoParser = UnitAttributeInfoParser;
      ParserCollection.CommandRequestInfoParser = CommandRequestInfoParser;
      ParserCollection.CommandResponseInfoParser = CommandResponseInfoParser;
      ParserCollection.LatentTypeInfoParser = LatentTypeInfoParser;
      ParserCollection.NamedLatentTypeInfoParser = NamedLatentTypeInfoParser;
      ParserCollection.ReferenceInfoParser = ReferenceInfoParser;

      // Initialize parsers

      ArrayInfoParser.initialize();
      BooleanInfoParser.initialize();
      CommandInfoParser.initialize();
      CommandPayloadInfoParser.initialize();
      CommandTypeInfoParser.initialize();
      ComplexSchemaInfoParser.initialize();
      ComponentInfoParser.initialize();
      ContentInfoParser.initialize();
      DateInfoParser.initialize();
      DateTimeInfoParser.initialize();
      DoubleInfoParser.initialize();
      DurationInfoParser.initialize();
      EntityInfoParser.initialize();
      EnumInfoParser.initialize();
      EnumValueInfoParser.initialize();
      FieldInfoParser.initialize();
      FloatInfoParser.initialize();
      IntegerInfoParser.initialize();
      InterfaceInfoParser.initialize();
      LongInfoParser.initialize();
      MapInfoParser.initialize();
      MapKeyInfoParser.initialize();
      MapValueInfoParser.initialize();
      NamedEntityInfoParser.initialize();
      NumericSchemaInfoParser.initialize();
      ObjectInfoParser.initialize();
      PrimitiveSchemaInfoParser.initialize();
      PropertyInfoParser.initialize();
      RelationshipInfoParser.initialize();
      SchemaInfoParser.initialize();
      SchemaFieldInfoParser.initialize();
      StringInfoParser.initialize();
      TelemetryInfoParser.initialize();
      TemporalSchemaInfoParser.initialize();
      TimeInfoParser.initialize();
      UnitInfoParser.initialize();
      UnitAttributeInfoParser.initialize();
      CommandRequestInfoParser.initialize();
      CommandResponseInfoParser.initialize();
      LatentTypeInfoParser.initialize();
      NamedLatentTypeInfoParser.initialize();
      ReferenceInfoParser.initialize();

      // Initialize validator classes

      ArrayInfoImpl.initialize();
      BooleanInfoImpl.initialize();
      CommandInfoImpl.initialize();
      CommandPayloadInfoImpl.initialize();
      CommandTypeInfoImpl.initialize();
      ComplexSchemaInfoImpl.initialize();
      ComponentInfoImpl.initialize();
      ContentInfoImpl.initialize();
      DateInfoImpl.initialize();
      DateTimeInfoImpl.initialize();
      DoubleInfoImpl.initialize();
      DurationInfoImpl.initialize();
      EntityInfoImpl.initialize();
      EnumInfoImpl.initialize();
      EnumValueInfoImpl.initialize();
      FieldInfoImpl.initialize();
      FloatInfoImpl.initialize();
      IntegerInfoImpl.initialize();
      InterfaceInfoImpl.initialize();
      LongInfoImpl.initialize();
      MapInfoImpl.initialize();
      MapKeyInfoImpl.initialize();
      MapValueInfoImpl.initialize();
      NamedEntityInfoImpl.initialize();
      NumericSchemaInfoImpl.initialize();
      ObjectInfoImpl.initialize();
      PrimitiveSchemaInfoImpl.initialize();
      PropertyInfoImpl.initialize();
      RelationshipInfoImpl.initialize();
      SchemaInfoImpl.initialize();
      SchemaFieldInfoImpl.initialize();
      StringInfoImpl.initialize();
      TelemetryInfoImpl.initialize();
      TemporalSchemaInfoImpl.initialize();
      TimeInfoImpl.initialize();
      UnitInfoImpl.initialize();
      UnitAttributeInfoImpl.initialize();
      CommandRequestInfoImpl.initialize();
      CommandResponseInfoImpl.initialize();
      LatentTypeInfoImpl.initialize();
      NamedLatentTypeInfoImpl.initialize();
      ReferenceInfoImpl.initialize();

      StandardElements.initialize();
    }
  }
}

ParserInitializer.initialized = false;
