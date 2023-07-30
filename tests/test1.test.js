const {
  calculateTip,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  add,
} = require("../frontend/src/math");

test("mathCheck", () => {
  const total = calculateTip(10);
  expect(total).toBe(12);
});

test("f2c", () => {
  expect(fahrenheitToCelsius(32)).toBe(0);
});
test("c2f", () => {
  expect(celsiusToFahrenheit(0)).toBe(32);
});

test("addtest", (done) => {
  add(3, 4).then((diff) => {
    expect(diff).toBe(7);
    done();
  });
});

test("add test async", async () => {
  const sum = await add(3, 7);
  expect(sum).toBe(10);
});
