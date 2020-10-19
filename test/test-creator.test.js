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

  describe("#_getClassNameFromExports", () => {
    it("should work fine", () => {
      const lines = [
        "",
        "export class User {",
        "}",
        ""
      ];

      const className = instance._getClassNameFromExports(lines);
      expect(className).to.equals("User");
    });
  });
});
