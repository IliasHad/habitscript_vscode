const os = require("os");

const { workspace, window, ViewColumn } = require("vscode");

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
  dashboardContent += `Today Coding Time:  ${getTodayCodingTime(fileDuration)}`;
  dashboardContent += "\n\n";

  dashboardContent += `Most Productive Day:  ${getDateFormat(
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
    dashboardContent += `File Name: ${el.fileName}  Coding Time: ${
      el.duration
    }`;
  });
  dashboardContent += "\n\n";
  console.log(sortLanguageByDuration(fileDuration));

  dashboardContent += `Sort File By Language`;
  dashboardContent += "\n\n";
  sortLanguageByDuration(fileDuration).forEach(el => {
    dashboardContent += `Language: ${el.language}  Coding Time: ${el.duration}`;
  });
  return dashboardContent;
}

// Format Date
function getDateFormat(date) {
  const dd = new Date(date).getDate();
  const mm = new Date(date).getMonth() + 1;
  const yy = new Date(date).getFullYear();
  return `${mm}-${dd}-${yy}`;
}

function getHours(date) {
  const hrs = new Date(date).getHours();
  return hrs;
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
  /*  fs.writeFile(file, dashboardContent, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        
      });*/
  //fs.appendFileSync(file, dashboardContent, "UTF-8",{'flags': 'a+'});
  // @ts-ignore
  fs.writeFileSync(file, dashboardContent, "UTF-8", { flags: "as+" });

  workspace.openTextDocument(file).then(doc => {
    // only focus if it's not already open
    window.showTextDocument(doc, ViewColumn.One, false).then(e => {
      // done
    });
  });
  console.log(fileDuration.length);
  if (fileDuration.length > 0) {
    console.log(getTodayCodingTime(fileDuration));
    console.log(getMostProductiveDay(fileDuration));
    console.log(getMostProductivTimeOfeDay(fileDuration));
    console.log(getMostUsedLanguage(fileDuration));
    console.log(sortFileByDuration(fileDuration));
    console.log(sortLanguageByDuration(fileDuration));
  }
}

function humanizeMinutes(sec) {
  // convert Secondes to Minutes
  let min = sec / 60;
  min = min || 0;
  let str = "";
  if (min === 1) {
    str = "1 min";
  } else if (min === 60) {
    str = "1 hr";
  } else if (min > 60) {
    let hrs = min / 60;
    if (hrs % 1 === 0) {
      str = hrs.toFixed(0) + " hrs";
    } else {
      str = (Math.round(hrs * 10) / 10).toFixed(1) + " hrs";
    }
  } else {
    // less than 60 seconds
    str = min.toFixed(0) + " min";
  }
  return str;
}
