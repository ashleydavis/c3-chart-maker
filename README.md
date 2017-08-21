# Chart-maker

A Node.js module for rendering a chart from a CSV file using a [C3](http://c3js.org/) spec.

It can be used from the command line or as a code library.
It's a great way to render server-side charts.

This library uses [Data-Forge](http://www.data-forge-js.com/), [Nightmare](http://www.nightmarejs.org/) and [C3](http://c3js.org/).

## Use from command line

### Installation

    npm install -g c3-chart-maker

### Usage

    c3-chart-maker <input-file> --chart=<c3-chart-file> --out=<output-image-file> [--css=<css-file-path>] [--show]

### Options

    chart       Specifies the file that defines the chart.
    out         Specifies the name of the image file to output for the chart.
    css         Specifies a CSS file that styles the chart.
    show        Optional parameter that shows the browser that renders the chart.

### Example

    c3-chart-maker myspreadsheet.csv --chart=mychartspec.json --out=mychart.png -ccss=mycssfile.css --show

## Use as a code library

## Installation

    npm install --save c3-chart-maker

## Usage

    const c3ChartMaker = require('c3-chart-maker');
    
    var inputFilePath = "your-input-file.csv";
    var chartTemplateFilePath = "my-chart-spec.json";
    var outputFilePath = "your-chart-output-file.png";
    var options: {
        show: true // Show browser used to render the chart.
        cssFilePath: "your-css-file.css", // Optional CSS file to style the chart.
    };

    c3ChartMaker(inputFilePath, chartTemplateFilePath, outputFilePath, options)
        .then(() => { 
            console.log('Done');
        })
        .catch(err => {
            console.error(err);
        });
    

## TODO

    Need to be able to merge multiple csv files.
    Should be able to plug blanks in the chart template with command line parameters.
    Need to be able to include CSS template for the chart so that it can be styled.
