import * as fs from "fs";

// Read the input JSON file
const rawData = fs.readFileSync("heartrate.json", "utf8");
const heartRateData = JSON.parse(rawData);

// Process heart rate data and calculate statistics
const outputData = heartRateData.map((data: any) => {
  const beatsPerMinute = data.beatsPerMinute;
  const startTime = data.timestamps.startTime;
  const endTime = data.timestamps.endTime;

  return {
    date: startTime.slice(0, 10), // Extract date from startTime
    min: beatsPerMinute,
    max: beatsPerMinute,
    median: beatsPerMinute,
    latestDataTimestamp: endTime,
  };
});

// Write the output to a JSON file
fs.writeFileSync("output.json", JSON.stringify(outputData, null, 2));

console.log("Output has been written to output.json");
