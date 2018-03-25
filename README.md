# c3-chart-maker

A Node.js module for rendering a chart from a CSV file using a [C3](http://c3js.org/) spec.

It can be used from the command line or as a code library.
It's a great way to render server-side charts.

This library uses [Data-Forge](http://www.data-forge-js.com/), [Nightmare](http://www.nightmarejs.org/) and [C3](http://c3js.org/).

For help please see [this example repo](https://github.com/ashleydavis/nodejs-chart-rendering-example) and [this post on The Data Wrangler](http://www.the-data-wrangler.com/node-js-chart-rendering-with-c3-and-nightmare/).

If you are interested in server-side / Node.js charting and visualization my book [Data Wrangling with JavaScript](http://bit.ly/2t2cJu2) has a whole chapter on this.

## Use from command line

### Installation

    npm install -g c3-chart-maker

### Usage

    c3-chart-maker <input-file> --chart=<c3-chart-file> --out=<output-image-file> [--export=<folder>] [--css=<css-file-path>] [--show] [--dump-chart]

### Options

    chart       Specifies the file that defines the chart.
    out         Specifies the name of the image file to output for the chart.
    export      Optionally specify a folder to export the interactive chart to.
    css         Specifies a CSS file that styles the chart.
    show        Optional parameter that shows the browser that renders the chart.
    dump-chart  Dump the expanded chart definition to standard out for debugging.


### Example

    c3-chart-maker myspreadsheet.csv --chart=mychartspec.json --out=mychart.png --css=mycssfile.css --show --dump-chart 

## Use as a code library

## Installation

    npm install --save c3-chart-maker

## Usage

    const c3ChartMaker = require('c3-chart-maker');
    
    var inputFilePath = "your-input-file.csv"; // NOTE: This can also be a DataForge dataframe.
    var chartTemplateFilePath = "my-chart-spec.json"; // NOTE: This can also be inline JSON.
    var outputFilePath = "your-chart-output-file.png";
    var options: {
        show: true                  // Show browser used to render the chart.
        css: "your-css-file.css",   // Optional CSS file to style the chart.
        dumpChart: true,            // Dump the expanded chart definition to the console for debugging.
        export: "folder-name",      // Optionally specify a folder to export an interactive chart to.
    };

    c3ChartMaker.fromFile(inputFilePath, chartTemplateFilePath, outputFilePath, options)
        .then(() => { 
            console.log('Done');
        })
        .catch(err => {
            console.error(err);
        });
