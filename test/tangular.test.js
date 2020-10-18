const { expect } = require("chai");
const Tangular = require("tangular");

describe("Tangular", () => {
  it("should work fine", () => {
    const str = Tangular.render("{{template}}", { template: "Test" });
    console.log(str);
    expect(str).to.equals("Test");
  });
});