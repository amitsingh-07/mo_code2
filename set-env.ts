import { readFileSync, writeFile, writeFileSync } from 'fs';
import * as beautify from 'json-beautify';

// tslint:disable-next-line:no-var-requires
require('json-beautify');

const supportedEnvironments = new Set(['dev', 'uat', 'prod']);
let environment = 'dev';
const pwd = __dirname;
console.log('current working directory :' + __dirname);
if (pwd.indexOf('mo_dev_web_build') > -1) {
  environment = 'dev';
} else if (pwd.indexOf('mo_uat_web_build') > -1) {
  environment = 'uat';
} else if (pwd.indexOf('mo_prod_web_build') > -1) {
  environment = 'prod';
}

console.log('******* CURRENT ENVIRONMENT :' + environment);
environment = environment.toLowerCase();

const inputPath = `./angular.config.json`;
const targetPath = `./angular.json`;

console.log('Configuring \'' + environment + '\' environment');

const angularConfig: any = readFileSync(inputPath);
console.log('Reading angular configuration');
const config = JSON.parse(angularConfig);
const defaultProject = config.defaultProject;
console.log('Building project :' + defaultProject);

// tslint:disable-next-line:max-line-length
config.projects[defaultProject].architect.build.configurations.common = config.projects[defaultProject].architect.build.configurations[environment];

writeFileSync(targetPath, beautify(config, null, 2, 100));

console.log(`Final angular configuration generated at ${targetPath}`);

const myInfoClientId = process.env.MY_INFO_CLIENT_ID || 'STG2-MYINFO-SELF-TEST';
const constantsPath = `./src/environments/constants.ts`;
const constantsConfig = `
export const environmentConstants = {
  myInfoClientId: '${myInfoClientId}'
};
`;
writeFileSync(constantsPath, constantsConfig);
console.log(`Environment variables configured at ${constantsPath}`);
