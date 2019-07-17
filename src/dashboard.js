const os = require("os");
var moment = require("moment");

const { workspace, window, ViewColumn } = require("vscode");
import { humanizeMinutes } from "./data";
const fs = require("fs");

let fileDuration = [];
let todayCodingTime = 0;
let file = getDashboardFile();
let JSONFile = getJSONFile();

let dashboardContent = `HabitScript Dashboard`;

console.log(JSONFile);

fs.exists(JSONFile, function(exists) {
  if (exists) {
    let data = fs.readFileSync(JSONFile);
    console.log("The file has been readed!");

    // @ts-ignore
    fileDuration = JSON.parse(data);

    addDashboardContent();
  }
});

function isWindows() {
  return process.platform.indexOf("win32") !== -1;
}

export function getDashboardFile() {
  const homedir = os.homedir();
  let softwareDataDir = homedir;
  if (isWindows()) {
    softwareDataDir += "\\habitScript.txt";
  } else {
    softwareDataDir += "/habitScript.txt";
  }
  return softwareDataDir;
}

export function getJSONFile() {
  const homedir = os.homedir();
  let softwareDataDir = homedir;
  if (isWindows()) {
    softwareDataDir += "\\habitScript.json";
  } else {
    softwareDataDir += "/habitScript.json";
  }
  return softwareDataDir;
}

function addDashboardContent() {
  dashboardContent += "\n\n";
  dashboardContent += `Today Coding Time:  ${humanizeMinutes(
    getTodayCodingTime(fileDuration)
  )}`;
  dashboardContent += "\n\n";
  dashboardContent += `Most Productive Day:  ${humanizeDate(
    getMostProductiveDay(fileDuration)
  )}`;
  dashboardContent += "\n\n";
  dashboardContent += `Most Productive Time Of Day:  ${getMostProductivTimeOfeDay(
    fileDuration
  )}`;
  dashboardContent += "\n\n";
  dashboardContent += `Most Used Programming Language:  ${getMostUsedLanguage(
    fileDuration
  )}`;
  dashboardContent += "\n\n";
  dashboardContent += `Sort File By Duration`;
  dashboardContent += "\n\n";
  sortFileByDuration(fileDuration).forEach(el => {
    dashboardContent += `File Name: ${
      el.fileName
    }  Coding Time: ${humanizeMinutes(el.duration)}`;
  });
  dashboardContent += "\n\n";
  console.log(sortLanguageByDuration(fileDuration));

  dashboardContent += `Sort File By Language`;
  dashboardContent += "\n\n";
  sortLanguageByDuration(fileDuration).forEach(el => {
    dashboardContent += `Language: ${
      el.language
    }  Coding Time: ${humanizeMinutes(el.duration)}`;
  });
  return dashboardContent;
}

// Format Date
export function getDateFormat(date) {
  return moment(date).format("MM-DD-YYYY");
}

function humanizeDate(date) {
  return moment(date).format("dddd, MMMM Do YYYY");
}
function getHours(date) {
  return moment(date).format("hh:mm a");
}

function getTodayCodingTime(duration) {
  let total = 0;

  duration.forEach(el => {
    if (
      getDateFormat(el.created_at) === getDateFormat(new Date().toISOString())
    ) {
      total += el.duration;
    }
  });

  todayCodingTime = total;
  return todayCodingTime;
}

// Get Most Productive Day in the Week
function getMostProductiveDay(durations) {
  const highest = durations.sort((a, b) => b.duration - a.duration)[0];

  return highest.created_at;
}

// Get Most Productive Time Of Day
function getMostProductivTimeOfeDay(durations) {
  const codingTimeToday = durations.filter(el => {
    return getDateFormat(el.created_at) === getDateFormat(new Date());
  });
  const highest = codingTimeToday.sort((a, b) => b.duration - a.duration)[0];
  const timeOfDay = getHours(highest.created_at);
  return timeOfDay;
}

//Get Most Used Programming Language All Time
function getMostUsedLanguage(durations) {
  const highest = durations.sort((a, b) => b.duration - a.duration)[0];

  return highest.language;
}

// Sort File Name By Duration
function sortFileByDuration(durations) {
  const highest = durations.sort((a, b) => b.duration - a.duration);

  return highest;
}

// Sort Programming Language By Duration

function sortLanguageByDuration(durations) {
  const highest = durations.sort((a, b) => b.duration - a.duration);

  return highest;
}

export function openDashboardFile() {
  
  // @ts-ignore
  fs.writeFileSync(file, dashboardContent, "UTF-8", { flags: "as+" });

  workspace.openTextDocument(file).then(doc => {
    // only focus if it's not already open
    window.showTextDocument(doc, ViewColumn.One, false).then(e => {
      // done
    });
  });
  console.log(fileDuration.length);

}
