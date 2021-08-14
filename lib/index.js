"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const exec_sh_1 = __importDefault(require("exec-sh"));
const path_1 = require("path");
const promises_1 = __importDefault(require("fs/promises"));
const exec = exec_sh_1.default.promise;
const packageJsonPath = path_1.resolve(process.cwd(), 'package.json');
const { version: packageVersion, semverPaths } = require(packageJsonPath);
const SEMVER = semverPaths;
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const label = process.argv[2];
        const labelNumber = parseLabel(label);
        const releaseMessage = process.argv[3];
        const version = incrementSemver(packageVersion, labelNumber);
        const { confirm } = yield inquirer_1.default.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `Creating new Git tag for ${packageVersion} => ${colorizeVersion(version, labelNumber)}\nShall I proceed?`
        });
        if (confirm) {
            try {
                console.log(chalk_1.default.green('Updating Files...'));
                yield updateFiles(SEMVER, version);
                console.log(chalk_1.default.green('Commiting Files...'));
                yield commit(version);
                console.log(chalk_1.default.green('Creating Release Tag...'));
                yield createTag(version, label, releaseMessage);
                // console.log(chalk.green('Pushing Files & Tag...'))
                // await exec(`git push --tags`)
                // console.log('Release Created and Deploying! 🚀')
            }
            catch (error) {
                console.error(chalk_1.default.red("Something went wrong while attempting to create git tags."));
                console.error("I recommend running\n\ngit status\n\nto find out what happened.");
                console.error("Make sure git is installed in this shell.");
            }
        }
    });
}
function parseLabel(label) {
    switch (label) {
        case 'major': return 0;
        case 'minor': return 1;
        case 'patch': return 2;
        default:
            console.error(`Received "${process.argv[2]}" and was expecting one of ["patch", "minor", "major"]`);
            process.exit(1);
    }
}
function incrementSemver(version, label) {
    const currentVersion = version
        .split('.')
        .map((n) => parseInt(n));
    currentVersion[label] = currentVersion[label] + 1;
    return currentVersion.join('.');
}
function colorizeVersion(version, label) {
    return version
        .split('.')
        .map((n, i) => i === label ? chalk_1.default.green(n) : n)
        .join('.');
}
function updateFiles(filePaths, version) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const path of filePaths) {
                const resolvedPath = path_1.resolve(path);
                const data = yield promises_1.default.readFile(resolvedPath, 'utf-8').then(JSON.parse);
                data.version = version;
                yield promises_1.default.writeFile(resolvedPath, JSON.stringify(data, null, 2));
            }
        }
        catch (error) {
            process.exit(1);
        }
    });
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function commit(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const commitMessage = `Updated version ${packageVersion} => ${version}`;
        yield exec(`git add . && git commit -m "${commitMessage}"`);
    });
}
function createTag(version, label, message) {
    return __awaiter(this, void 0, void 0, function* () {
        message = message ? ` - ${message}` : '';
        const tagMessage = `${capitalize(label)} update: ${packageVersion} => ${version}${message}`;
        yield exec(`git tag -a ${version} -m "${tagMessage}"`);
        console.log(tagMessage);
    });
}
