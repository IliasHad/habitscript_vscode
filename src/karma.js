const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export function getKarma(totalCodingTime) {
  let codingPoints = 0;

  console.log('Today Coding Time', totalCodingTime)
  // Convert Coding Time From Secondes to Hours
  let CodingTimeInMinutes = convertMsToMinutes(totalCodingTime);

  console.log(CodingTimeInMinutes);
  // Every 2 Minutes is counted as 1 Karma
  //console.log( Math.round(parseInt(CodingTimeInMinutes) * 0.5))
  // @ts-ignore
  codingPoints = Math.round(parseInt(CodingTimeInMinutes) * 0.5);

  return codingPoints;
}
function convertMsToMinutes(ms) {
  console.log(ms)
  return Math.round(parseInt(ms) / 60000);
}
