import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fetch from "node-fetch";

const filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(filename);

const roundCurrency = (amount, fix = 2) => {
  const [l, r] = amount.toString().split(".");
  return r && r.length > fix
    ? Number(l) + parseFloat(`.${r.slice(0, fix)}`) + 1 / 10 ** fix
    : amount.toFixed(2);
};

const getWeekNumber = (date) => {
  const currentDate = new Date(date);
  const yearStart = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
  const numberOfDays = Math.floor(
    (currentDate - yearStart) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((currentDate.getDay() + 1 + numberOfDays) / 7);
};

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

    const resCashIn = await fetch(
      "http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in"
    );
    const dataCashIn = await resCashIn.json();

    const resCashOutNatural = await fetch(
      "http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural"
    );
    const dataCashOutNatural = await resCashOutNatural.json();

    const resCashOutLegal = await fetch(
      "http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical"
    );
    const dataCashOutLegal = await resCashOutLegal.json();

    const rawData = fs.readFileSync(filePath);
    const inputData = JSON.parse(rawData);

    const userData = {};

    inputData.forEach((data) => {
      const { amount } = data.operation;

      if (data.type === "cash_in") {
        const limit = dataCashIn.max.amount;
        let fee = (amount * dataCashIn.percents) / 100;
        fee = fee > limit ? limit : fee;
        console.log(roundCurrency(fee));
      } else if (data.user_type === "juridical") {
        const limit = dataCashOutLegal.min.amount;
        let fee = (amount * dataCashOutLegal.percents) / 100;
        fee = fee < limit ? limit : fee;
        console.log(roundCurrency(fee));
      } else {
        const weekNumber = getWeekNumber(data.date);
        if (userData[data.user_id]) {
          if (userData[data.user_id][weekNumber]) {
            userData[data.user_id][weekNumber] = {
              amount: userData[data.user_id][weekNumber].amount + amount,
            };
          } else {
            userData[data.user_id][weekNumber] = { amount };
          }
        } else {
          userData[data.user_id] = {};
          userData[data.user_id][weekNumber] = { amount };
        }

        if (
          userData[data.user_id][weekNumber].amount <=
          dataCashOutNatural.week_limit.amount
        ) {
          console.log(roundCurrency(0));
        } else {
          const limit = dataCashOutNatural.week_limit.amount;
          const pc = dataCashOutNatural.percents;
          const fee = ((amount > limit ? amount - limit : amount) * pc) / 100;
          console.log(roundCurrency(fee));
        }
      }
    });
  });
});
