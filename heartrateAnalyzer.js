"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var moment = require("moment");
function analyzeHeartRate(data) {
    var result = [];
    var groupedByDate = data.reduce(function (acc, measurement) {
        var date = moment(measurement.timestamps.startTime).format("YYYY-MM-DD");
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(measurement);
        return acc;
    }, {});
    for (var date in groupedByDate) {
        var measurements = groupedByDate[date];
        var min = Math.min.apply(Math, measurements.map(function (m) { return m.beatsPerMinute; }));
        var max = Math.max.apply(Math, measurements.map(function (m) { return m.beatsPerMinute; }));
        var sortedBPM = measurements
            .map(function (m) { return m.beatsPerMinute; })
            .sort(function (a, b) { return a - b; });
        var median = sortedBPM.length % 2 === 0
            ? (sortedBPM[sortedBPM.length / 2 - 1] +
                sortedBPM[sortedBPM.length / 2]) /
                2
            : sortedBPM[Math.floor(sortedBPM.length / 2)];
        var latestDataTimestamp = moment(measurements[measurements.length - 1].timestamps.startTime).format();
        result.push({
            date: date,
            min: min,
            max: max,
            median: median,
            latestDataTimestamp: latestDataTimestamp,
        });
    }
    return result;
}
function writeOutputToFile(output) {
    fs.writeFileSync("output.json", JSON.stringify(output, null, 2));
}
// Read input data from the JSON file
var inputData = JSON.parse(fs.readFileSync("heartrate.json", "utf-8"));
// Analyze and process all data
var outputData = analyzeHeartRate(inputData);
// Write the result to the output file
writeOutputToFile(outputData);
