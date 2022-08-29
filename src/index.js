import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { fetchApi, handleData } from "./utils.js";

const filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(filename);
const questions = [
  {
    type: "input",
    name: "name",
    message: "What's the file path?",
  },
];
inquirer.prompt(questions).then((answers) => {
  const extension = answers.name.slice(-5);
  if (extension !== ".json") {
    console.log("File is not a valid json file");
    return;
  }
  const filePath = path.join(currentDir, answers.name);
  fs.access(filePath, fs.F_OK, async (err) => {
    if (err) {
      console.error(`${filePath} does not exist.`);
      return;
    }

    const dataCashIn = await fetchApi(
      "http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in"
    );

    const dataCashOutNatural = await fetchApi(
      "http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural"
    );

    const dataCashOutLegal = await fetchApi(
      "http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical"
    );

    if (dataCashIn && dataCashOutNatural && dataCashOutLegal) {
      const rawData = fs.readFileSync(filePath);
      const inputData = JSON.parse(rawData);

      inputData.forEach((data) => {
        handleData(data, dataCashIn, dataCashOutNatural, dataCashOutLegal);
      });
    } else {
      console.log(
        "Error in api fetching. Please check url or try again later."
      );
    }
  });
});
