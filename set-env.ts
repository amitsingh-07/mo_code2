import { readFile, writeFile } from 'fs';

// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's Argv object
console.log(process.env);
const environment = process.env.NODE_ENV || 'uat' ;
const isProd = environment === 'prod';

const inputPath = `./src/environments/environment.${environment}.ts`;
const targetPath = `./src/environments/environment.ts`;

readFile(inputPath, function read(err, data) {
    if (err) {
        throw err;
    }
    writeFile(targetPath, data, function (err) {
        if (err) {
            console.log(err);
        }
        console.log(`Output generated at ${targetPath}`);
    });
});
