const fs = require("fs");
const path = require("path");
const Tangular = require("tangular");
const templatesFolder = path.join(__dirname, "..", "templates");

class TestCreator {
  constructor(fsOverride) {
    this.fs = fsOverride || fs;
  }

  /**
   * @param {string} [filename] File name
   * @param {string} [content] Content
   */
  run(filename, content) {
    if (!content) {
      content = this.fs.readFileSync(filename, "utf8");
    }

    const lines = (content || "").trim().split("\n").map(m => m.trim()).filter(m => m && m !== "");

    let className = lines.find(m => m.startsWith("module.exports"));
    if (!className) {
      console.log("Class name not found");
      return;
    }

    className = className.substr(className.indexOf("=") + 1).trim();
    if (className.endsWith(";")) {
      className = className.substr(0, className.indexOf(";"));
    }

    return this._writeClassTests(filename, className);
  }

  _writeClassTests(filename, className) {
    const classNameForType = `{${className}}`;

    const template = this.fs.readFileSync(path.join(templatesFolder, "class-test.template"), "utf8");

    let requiredFilenameInsideTest = path
      .normalize(path.join("../", filename))
      .split("\\")
      .join("/");

    if (requiredFilenameInsideTest.endsWith(".js")) {
      requiredFilenameInsideTest = requiredFilenameInsideTest.substr(0, requiredFilenameInsideTest.indexOf(".js"));
    }

    const content = Tangular.render(template, { className, classNameForType, filename: requiredFilenameInsideTest });

    const testFilename = `${path.basename(filename, ".js")}.test.js`;

    const testFile = path.join(process.cwd(), "test", testFilename);

    this.fs.writeFileSync(testFile, content, "utf8");

    return testFile;
  }
}

module.exports = TestCreator;
