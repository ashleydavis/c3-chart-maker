'use strict';

module.exports = function (dataFrame, argv) {

    var x = 0;
    var tickValues = dataFrame.getSeries("Date")
        .where(row => {
            return (x++ % 5) === 0;
        })
        .toArray();

    return {
        "size": {
            "height": 600,
            "width": 1200
        },        
        "series": {
            "x": "Date",
            "Close": "Close",
            "Volume": "Volume"
        },
        "data": {
            "x": "x",
            "type": "line",
            "axes": {
                "Volume": "y2"
            },
        },
        "axis": {
            "x": {
                "type": "timeseries",
                "tick": {
                    "format": "%e %b %y",
                    //todo:
                    //values: tickValues,
                    //culling: false,
                    rotate: 25,
                }
            },
            "y": {
                "label": {
                    "text": "Close",
                    "position": "outer-middle"
                }
            },
            "y2": {
                "show": true,
                "label": {
                    "text": "Signal",
                    "position": "outer-middle"
                }
            }
        },
        "grid": {
            "x": {
                "show": true
            },
            "y": {
                "show": true
            }
        },
        "point": {
            "show": false   
        },
        "transition": {
            "duration": 0
        }
    };
};