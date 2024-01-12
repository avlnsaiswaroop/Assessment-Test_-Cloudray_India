// Import necessary packages
import * as fs from 'fs';

// Read the input JSON file
const rawData = fs.readFileSync('heartrate.json', 'utf8');
const heartRateData = JSON.parse(rawData);

// Function to calculate median
function calculateMedian(values: number[]): number {
  const sortedValues = values.sort((a, b) => a - b);
  const middle = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
  } else {
    return sortedValues[middle];
  }
}

// Process heart rate data and calculate statistics
const outputData = heartRateData.map((day: any) => {
  const beatsPerMinute = day.measurements.map((measurement: any) => measurement.bpm);
  const latestDataTimestamp = day.measurements[day.measurements.length - 1].timestamp;

  return {
    date: day.date,
    min: Math.min(...beatsPerMinute),
    max: Math.max(...beatsPerMinute),
    median: calculateMedian(beatsPerMinute),
    latestDataTimestamp,
  };
});

// Write the output to a JSON file
fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));

console.log('Output has been written to output.json');
