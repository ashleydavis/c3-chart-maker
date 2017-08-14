#!/usr/bin/env node

//
// This file is designed to be run from the command line.
// It generates a chart using Nigthmare, Data-Forge and C3.
// Please see README.md for examples.
//

const argv = require('yargs').argv;
const chartMaker = require('./index');

if (argv.v || argv.version) {
    var fs = require('fs');
    var path = require('path');
    console.log('c3-chart-maker version ' + JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'))).version);
    process.exit(0);
}

if (argv._.length < 1) {
    console.error("Please specify input file on command line.");

    console.log("Usage:");
    console.log("  c3-chart-maker <input-file.csv> --chart=<chart-template-file> --out=<output-image-file.png>");
    process.exit(1);
}

if (!argv.chart) {
    console.error("Please specify chart template file with parameter --chart=<chart-template-file>");
    process.exit(1);
}

if (!argv.out) {
    console.error("Please specify output image with parameter --out=<output-image-file.png>");
    process.exit(1);
}

var inputFilePath = argv._[0].toString();
var chartTemplateFilePath = argv.chart.toString();
var outputFilePath = argv.out.toString();

chartMaker(inputFilePath, chartTemplateFilePath, outputFilePath)
    .then(() => { 
        console.log('Done');
    })
    .catch(err => {
        console.error(err);
    })
