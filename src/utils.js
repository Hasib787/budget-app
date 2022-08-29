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