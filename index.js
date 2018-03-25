'use strict';

//
// This is a function to generate a chart using Nightmare, Data-Forge and C3.
// Please see README.md for examples.
//
// Parameters:
//
//      inputFilePath -     The input CSV file to load.
//      chartTemplateFile - Path to a C3 spec file (either json or js).
//      outputFilePath -    Path that specifies where to save the chart's output image.
//      options -           Options to control rendering.
//          show            Set to true to show the browser window that renderers the chart.
//          export          Path to export the chart to (can be used to inspect interactive chart later).
//			template 		Optionaly wet the template used to render the chart.
//          verbose         Set to true for debug output.
//

const Nightmare = require('nightmare');
const dataForge = require('data-forge');
const path = require('path');
const assert = require('chai').assert;
const fs = require('fs-extra');
const Sugar = require('sugar');

function composeChartTemplate (chartTemplateInputPath, chartTemplateOutputPath, chartDefinition) {

    fs.copySync(chartTemplateInputPath, chartTemplateOutputPath);

    let chartJson = JSON.stringify(chartDefinition, null, 4);
    chartJson = chartJson.split("\n").map(line => "        " + line).join("\n");

    fs.writeFileSync(
        path.join(chartTemplateOutputPath, "index.js"), 
        "$(function () {\n" +
        "    c3.generate(\n" + 
        chartJson + "\n" +
        "    );\n" +
        "});"
    );            
};

module.exports = function (inputData, chartDefinition, outputFilePath, options, nightmare) {
    assert.isString(outputFilePath, "c3-chart-maker: Expected parameter outputFilePath to be a string.");    

    options = options || {};

    function verbose (msg) {
        if (options.verbose) {
            console.log(msg);
        }    
    };   

    verbose("Rendering chart to " + outputFilePath);

    var data;
    if (Sugar.Object.isString(inputData))  {
        if (inputData.endsWith(".csv")) {
            verbose("<< Input from CSV file " + inputData);

            data = dataForge.readFileSync(inputData)
                .parseCSV()
                .toArray();
        }
        else { // Assume JSON file.
            verbose("<< Input from JSON file " + inputData);

            data = JSON.parse(fs.readFileSync(inputData));
        }
    }
    else if (Sugar.Object.isArray(inputData)) {
        verbose("<< Input from JavaScript array.");

        data = inputData;
    }
    else {
        verbose("<< Input from DataForge DataFrame.");

        data = inputData.toArray(); // Assume DataFrame.
    }

    var chart = null;

    if (Sugar.Object.isString(chartDefinition)) {
        if (chartDefinition.endsWith(".json")) {
            verbose("<< Chart definition from JSON file " + chartDefinition);

            // Load json file.
            chart = JSON.parse(fs.readFileSync(chartDefinition, 'utf-8'));
        }
        else if (chartDefinition.endsWith(".js")) {
            verbose("<< Chart definition from JavaScript file " + chartDefinition);

            // Load Node.js module.
            var fullPath = path.resolve(chartDefinition);
            chart = require(fullPath)(data, options);
        }
        else {  
            throw new Error("Unable to determine type of input file " + chartDefinition + ", expected a .json or .js file." );
        }
    }
    else {
        chart = chartDefinition;
    }

    if (!chart.data) {
        chart.data = {};
    }

    if (chart.series) { // THIS SECTION IS DEPRECATED.
        console.error("Usage of deprecated field: 'series'.");

        if (!chart.data.columns) {
            chart.data.columns = [];
        }

        var series = Object.keys(chart.series);
        var dataFrame = new dataForge.DataFrame(data);
        series.forEach(seriesName => {
            var dataSeries = chart.series[seriesName];
            if (Sugar.Object.isString(inputData) && seriesName !== "x") {
                dataFrame = dataFrame.parseFloats(dataSeries).bake();
            }

            chart.data.columns.push(
                [seriesName].concat(
                    dataFrame.getSeries(dataSeries)
                        .select(v => v === undefined ? null : v)
                        .toArray()
                )
            )
        });
    }
    else if (!chart.data.columns && !chart.data.json) {
        chart.data.json = data;
    }

    if (options.dumpChart) {
        console.log(JSON.stringify(chart, null, 4));
    }

    const chartTemplateInputPath = options.template && path.resolve(options.template) || path.join(__dirname, "template");
    verbose("<< Using chart template " + chartTemplateInputPath);

    const chartTemplateOutputPath = options.export && path.resolve(options.export) || path.join(__dirname, "chart-tmp");
    verbose(">> Outputing interactive chart to " + chartTemplateOutputPath);

    verbose(">> Outputing rendered chart to " + outputFilePath);

    composeChartTemplate(
        chartTemplateInputPath,
        chartTemplateOutputPath,
        chart        
    );

    var filePath = path.join(chartTemplateOutputPath, 'index.html');
    var url = 'file://' + filePath;
    var selector = 'svg';

    var ownNightmare = false;

    if (!nightmare) {
        ownNightmare = true;
        nightmare = new Nightmare({
            frame: false,
            show: options.show,
        });
    }

    nightmare.on('console', function (type, message) {

        if (type === 'log') {
            console.log('LOG: ' + message);
            return; // Don't bother with logs.
        }

        if (type === 'warn') {
            console.warn('LOG: ' + message);
            return;
        }

        if (type === 'error') {
            throw new Error("Browser JavaScript error: " + message);
        }
    });

    nightmare.goto(url);

    return nightmare.wait(selector)
        .evaluate(selector => {
            const body = document.querySelector('body');
            const element = document.querySelector(selector);
            const rect = element.getBoundingClientRect();
            return {
                bodyWidth: body.scrollWidth,
                bodyHeight: body.scrollHeight,
                x: rect.left,
                y: rect.top,
                height: rect.bottom - rect.top,
                width: rect.right - rect.left,
            };
        }, selector)
        .then(rect => {
            return nightmare.viewport(rect.bodyWidth, rect.bodyHeight)
                .screenshot(outputFilePath, rect);
        })
        //.then(() => nightmare.screenshot("whole-page.png"))
        .then(() => {
            if (ownNightmare) {
                return nightmare.end();
            }
        })
        .catch(err => {
            if (ownNightmare) {
                return nightmare.end()
                    .then(() => {
                        throw err
                    });
            }
            else {
                throw err
            }
        });
};
