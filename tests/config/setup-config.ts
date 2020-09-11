import prompts = require("prompts");
import fs  = require('fs');
import setupConfigApi from "./setup-config-api";
import {ApiConfig} from "../../src";
import {InterfolioUnit} from "../../src/units/unit-api";
import setupConfigUnit from "./setup-config-unit";

export type TestConfig = {
  apiConfig?: ApiConfig,
  unit?: InterfolioUnit
}

export const createConfig = async (): Promise<{filename: string, config: TestConfig} | null> => {
  const fileResponse = await prompts.prompt({
    type: "text",
    name: "filename",
    initial: __dirname + "/test-config.json",
    message: "Config filename"
  });

  const filename: string = fileResponse.filename;

  try {
    const file = await fs.readFileSync(filename);
    const config = JSON.parse(file.toString());
    const overwrite = await prompts.prompt({
      type: "select",
      name: "overwrite",
      message: "File already exists.  Would you like to update?",
      choices: [
        {title: 'Yes', value: true},
        {title: 'No/Cancel', value: false}
      ]
    });

    if(overwrite.overwrite) {
      return {
        filename,
        config
      };
    }
    else {
      return null;
    }


  }
  catch (error) {
    const createNew = await prompts.prompt({
      type: "select",
      name: "createNew",
      message: "File does not exist or is unparseable.  Would you like to overwrite/create new?",
      choices: [
        {title: 'Yes', value: true},
        {title: 'Cancel', value: false}
      ]
    });

    if(createNew.createNew) {
      return {
        filename,
        config: {}
      };
    }
    else {
      return null;
    }
  }
};

export const run = async (): Promise<void> => {
  try {
    //get the file and the config
    const fileAndConfig = await createConfig();
    if(fileAndConfig === null) return;

    const config = fileAndConfig.config;

    //setup connection
    await setupConfigApi(config);
    await setupConfigUnit(config);

    fs.writeFileSync(fileAndConfig.filename, JSON.stringify(fileAndConfig.config, null, '  '));


  }
  catch(error) {
    console.log("There was an error");
    console.log(error);
  }
};


run();
