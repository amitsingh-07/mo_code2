import { readFileSync, writeFileSync } from 'fs';
import * as beautify from 'json-beautify';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();
// tslint:disable-next-line:no-var-requires
require('json-beautify');

let environment = process.env.NODE_ENV || 'DEV';
environment = environment.toLowerCase();

const inputPath = `./angular.config.json`;
const targetPath = `./angular.json`;

console.log('Configuring ' + environment + ' environment');

const angularConfig: any = readFileSync(inputPath);
console.log('Reading package json');
const config = JSON.parse(angularConfig);
const defaultProject = config.defaultProject;
console.log('defaultProject :' + defaultProject);

// tslint:disable-next-line:max-line-length
config.projects[defaultProject].architect.build.configurations.common = config.projects[defaultProject].architect.build.configurations[environment];

writeFileSync(targetPath, beautify(config, null, 2, 100));

console.log(`Output generated at ${targetPath}`);
