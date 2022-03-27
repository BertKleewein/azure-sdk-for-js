// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const { ParserCodeGenerator } = require("./dist/index.js");

console.log("Generating code");
ParserCodeGenerator.execute("dtdl/digest.json", "../dtdl-parser/src/parser", "2").then(() => {
  console.log("Code generation complete");
});
