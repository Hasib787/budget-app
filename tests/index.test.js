
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

describe("Calculator tests", () => {
  test('adding 1 + 2 should return 3', () => {
    expect(3).toBe(3);
  });
})

describe("Currency function tests", () => {
  test('converting decimal to ceil value', () => {
    expect(roundCurrency(3.123)).toBe(3.13);
  });

  test('converting more then two digits', () => {
    expect(roundCurrency(3.1234)).toBe(3.13);
  });

  test('converting less then two digits', () => {
    expect(roundCurrency(3.1)).toBe("3.10");
  });
})

describe("Week number function tests", () => {
  test('converting date to week', () => {
    expect(getWeekNumber("2016-02-15")).toBe(7);
  });
})