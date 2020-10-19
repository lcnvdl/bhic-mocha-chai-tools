const fs = require("fs");
const path = require("path");
const Tangular = require("tangular");
const templatesFolder = path.join(__dirname, "..", "templates");

class TestCreator {
  constructor(fsOverride) {
    this.fs = fsOverride || fs;
  }

  /**
   * @param {string} filename File name
   * @param {string} fileType File type
   * @param {string} [content] Content
   */
  run(filename, fileType, content) {
    if (!content) {
      content = this.fs.readFileSync(filename, "utf8");
    }

    const lines = (content || "").trim().split("\n").map(m => m.trim()).filter(m => m && m !== "");

    let className = this._getClassNameFromModule(lines) ||
      this._getClassNameFromExports(lines);

    if (!className) {
      return null;
    }

    return this._writeClassTests(filename, className, fileType);
  }

  _getClassNameFromExports(lines) {
    let className = lines.find(m => m.startsWith("export class"));
    if (!className) {
      return null;
    }

    className = className.trim().split(" ")[2];

    return className;
  }

  _getClassNameFromModule(lines) {
    let className = lines.find(m => m.startsWith("module.exports"));
    if (!className) {
      return null;
    }

    className = className.substr(className.indexOf("=") + 1).trim();
    if (className.endsWith(";")) {
      className = className.substr(0, className.indexOf(";"));
    }

    return className;
  }

  _writeClassTests(filename, className, fileType) {
    const classNameForType = `{${className}}`;
    const classNameForImport = `{ ${className} }`;

    const template = this.fs.readFileSync(path.join(templatesFolder, `class-test.${fileType}.template`), "utf8");

    let requiredFilenameInsideTest = path
      .normalize(path.join("../", filename))
      .split("\\")
      .join("/");

    const format = `.${fileType}`;

    if (requiredFilenameInsideTest.endsWith(format)) {
      requiredFilenameInsideTest = requiredFilenameInsideTest.substr(0, requiredFilenameInsideTest.indexOf(format));
    }

    const content = Tangular.render(template, {
      className,
      classNameForType,
      classNameForImport,
      filename: requiredFilenameInsideTest
    });

    const testFilename = `${path.basename(filename, format)}.test${format}`;

    let testFolder = path.join(process.cwd(), "test");

    if (!fs.existsSync(testFolder)) {
      testFolder += "s";
      if (!fs.existsSync(testFolder)) {
        throw new Error("The test folder does not exists");
      }
    }

    const testFile = path.join(testFolder, testFilename);

    this.fs.writeFileSync(testFile, content, "utf8");

    return testFile;
  }
}

module.exports = TestCreator;
