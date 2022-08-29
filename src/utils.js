import fetch from "node-fetch";

export const roundCurrency = (amount, fix = 2) => {
  const [l, r] = amount.toString().split(".");
  return r && r.length > fix
    ? Number(l) + parseFloat(`.${r.slice(0, fix)}`) + 1 / 10 ** fix
    : amount.toFixed(2);
};

export const getWeekNumber = (date) => {
  const currentDate = new Date(date);
  const yearStart = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
  const numberOfDays = Math.floor(
    (currentDate - yearStart) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((currentDate.getDay() + 1 + numberOfDays) / 7);
};

export const fetchApi = async (url) => {
  try {
    const data = await fetch(url);
    if (data.status === 200) {
      return data.json();
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const userData = {};

export const handleData = (data, dataCashIn, dataCashOutNatural, dataCashOutLegal) => {
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
}