
// example.js
const { ModelsRepositoryClient } = require("@azure/iot-modelsrepository");
const { ModelParsingOption, createParser } = require("./dist")

async function main() {
  const dtmi = "dtmi:com:example:TemperatureController;1";

  const repositoryClient = new ModelsRepositoryClient();
  const modelParser = createParser(ModelParsingOption.PermitAnyTopLevelElement);

  // Bind the model repository to the parser so the parser can use it to load
  // any dependant models.
  modelParser.getModels = repositoryClient.getModels.bind(repositoryClient);

  // Get the model from the repository.
  const models = await repositoryClient.getModels(dtmi);

  // Loop through the models and output the contents of each model
  for (const [key, value] of Object.entries(models)) {
    console.log()
    console.log(`model: ${key}`);
    const modelDict = await modelParser.parse([JSON.stringify(value)]);

    for (const [key2, value2] of Object.entries(modelDict)) {
      console.log(`-- ${value2.entityKind}: ${key2} = ${value2.description?.en}`);
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
