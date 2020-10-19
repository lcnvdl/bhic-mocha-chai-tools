const path = require("path");
const fs = require("fs");
const TestCreator = require("./src/test-creator");

module.exports = ({ CommandBase, commands }) => {
  const scripts = path.join(__dirname, "scripts");

  const PipeCommand = commands.pipe;

  class MochaiCommand extends CommandBase {
    /**
     * @param {string[]} args Arguments
     */
    async run(args) {
      for (let i = 0; i < args.length; i++) {
        if (args[i] === "--help" || args[i] === "-h") {
          return this._showHelp();
        }

        if (args[i] === "install") {
          return await this._install();
        }

        if (args[i] === "create") {
          return this._create(args.slice(i + 1));
        }
      }

      return this._showHelp();
    }

    /**
     * @param {string[]} args Arguments
     */
    _create(args) {
      if (!fs.existsSync(args[0])) {
        return this.codes.invalidArguments;
      }

      const tc = new TestCreator();

      const testFileName = tc.run(args[0], args[1] || "js");

      console.log(`Test created: ${path.basename(testFileName)}`);

      return this.codes.success;
    }

    async _install() {
      const env = this.environment.fork(__dirname);
      const pipe = new PipeCommand(env);
      await pipe.loadFromFile(path.join(scripts, "install-mochai.cmd"));
      return this.codes.success;
    }

    _showHelp() {
      console.log("Mocha Chai");
      console.log("install\t\tInstalls mocha and chai");
      console.log("create <path> [js | ts]");
      return this.codes.success;
    }
  }

  return MochaiCommand;
};
