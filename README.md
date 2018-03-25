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

    c3-chart-maker <input-file> --chart=<c3-chart-file> --out=<output-image-file> [--export=<folder>] [--template=<chart-template-folder>] [--show] [--dump-chart] [--verbose]

### Options

    chart       Specifies the file that defines the chart.
    out         Specifies the name of the image file to output for the chart.
    export      Optionally specify a folder to export the interactive chart to.
    show        Optional parameter that shows the browser that renders the chart.
    dump-chart  Dump the expanded chart definition to standard out for debugging.
    template    Template directory that contains the HTML and CSS files for the chart. You can use this to completely override the chart template.
    verbose     Enable this option for verbose debug output.


### Example

    c3-chart-maker myspreadsheet.csv --chart=mychartspec.json --out=mychart.png --show --dump-chart 

## Use as a code library

## Installation

    npm install --save c3-chart-maker

## Usage

    const c3ChartMaker = require('c3-chart-maker');
    
    var inputFilePath = "your-input-file.csv"; // NOTE: This can also be a DataForge dataframe, an array of data or a path to a JSON file.
    var chartTemplateFilePath = "my-chart-spec.json"; // NOTE: This can also be inline JSON or the path to a Node.js module with a function that builds the chart definition.
    var outputFilePath = "your-chart-output-file.png";
    var options: {
        show: true                  // Show browser used to render the chart.
        dumpChart: true,            // Dump the expanded chart definition to the console for debugging.
        export: "folder-path",      // Optionally specify a folder to export an interactive chart to.
        template: "folder-path"     // Optionally override the chart template with your own custom version.
    };

    c3ChartMaker(inputFilePath, chartTemplateFilePath, outputFilePath, options)
        .then(() => { 
            console.log('Done');
        })
        .catch(err => {
            console.error(err);
        });
