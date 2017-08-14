//
// This is a function to generate a chart using Nightmare, Data-Forge and C3.
// Please see README.md for examples.
//
// Parameters:
//
//      inputFilePath -     The input CSV file to load.
//      chartTemplateFile - Path to a C3 spec file (either json or js).
//      outputFilePath -    Path that specifies where to save the chart's output image.
//

const Nightmare = require('nightmare');
const dataForge = require('data-forge');
const path = require('path');
const assert = require('chai').assert;
const fs = require('fs');

module.exports = function (inputFilePath, chartTemplateFilePath, outputFilePath) {
    assert.isString(inputFilePath, "c3-chart-maker: Expected parameter inputFilePath to be a string.");
    assert.isString(chartTemplateFilePath, "c3-chart-maker: Expected parameter chartTemplateFilePath to be a string.");
    assert.isString(outputFilePath, "c3-chart-maker: Expected parameter outputFilePath to be a string.");

    var dataFrame = dataForge.readFileSync(inputFilePath)
        .parseCSV();

    var nightmare = new Nightmare({
        frame: false,
        //show: true,
    });

    var filePath = path.join(__dirname, 'template.html');
    var url = 'file://' + filePath;
    var selector = '#view svg';

    var chart = JSON.parse(fs.readFileSync(chartTemplateFilePath, 'utf-8'));

    if (!chart.series) {
        throw new Error("Chart spec must have an 'series' hash that maps the columns in the CSV file to series in the chart.");
    }

    if (!chart.data) {
        chart.data = {};
    }

    if (!chart.data.columns) {
        chart.data.columns = [];
    }

    chart.bindto = "#view";
    chart.data.x = "x";

    var series = Object.keys(chart.series);
    series.forEach(seriesName => {
        chart.data.columns.push(
            [seriesName].concat(
                dataFrame.getSeries(chart.series[seriesName])
                    .select(v => v === undefined ? null : v)
                    .toArray()
            )
        )
    });

    return nightmare
        .goto(url)
        .evaluate(chart => {
            c3.generate(chart);
        }, chart)
        .wait(selector)
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
        .then(() => nightmare.end());
};