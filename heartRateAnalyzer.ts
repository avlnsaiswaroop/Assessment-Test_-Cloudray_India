import * as fs from "fs";
import * as moment from "moment";

interface HeartRateData {
  beatsPerMinute: number;
  timestamps: {
    startTime: string;
    endTime: string;
  };
}

interface OutputData {
  date: string;
  min: number;
  max: number;
  median: number;
  latestDataTimestamp: string;
}

function analyzeHeartRate(data: HeartRateData[]): OutputData[] {
  const result: OutputData[] = [];

  const groupedByDate = data.reduce((acc, measurement) => {
    const date = moment(measurement.timestamps.startTime).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(measurement);
    return acc;
  }, {});

  for (const date in groupedByDate) {
    const measurements = groupedByDate[date];

    const min = Math.min(...measurements.map((m) => m.beatsPerMinute));
    const max = Math.max(...measurements.map((m) => m.beatsPerMinute));

    const sortedBPM = measurements
      .map((m) => m.beatsPerMinute)
      .sort((a, b) => a - b);
    const median =
      sortedBPM.length % 2 === 0
        ? (sortedBPM[sortedBPM.length / 2 - 1] +
            sortedBPM[sortedBPM.length / 2]) /
          2
        : sortedBPM[Math.floor(sortedBPM.length / 2)];

    const latestDataTimestamp = moment(
      measurements[measurements.length - 1].timestamps.startTime
    ).format();

    result.push({
      date,
      min,
      max,
      median,
      latestDataTimestamp,
    });
  }

  return result;
}

function writeOutputToFile(output: OutputData[]) {
  fs.writeFileSync("output.json", JSON.stringify(output, null, 2));
}

// Read input data from the JSON file
const inputData: HeartRateData[] = JSON.parse(
  fs.readFileSync("heartrate.json", "utf-8")
);

// Analyze and process all data
const outputData = analyzeHeartRate(inputData);

// Write the result to the output file
writeOutputToFile(outputData);
