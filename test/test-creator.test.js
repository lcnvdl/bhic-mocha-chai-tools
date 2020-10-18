const { expect } = require("chai");
const TestCreator = require(".././src/test-creator.js")

/** @type {TestCreator} */
let instance = null;

describe("TestCreator", () => {
  beforeEach(() => {
    instance = new TestCreator();
  });

  describe("#constructor", () => {
    it("should work fine", () => {
      expect(instance).to.be.ok;
    });
  });
});
