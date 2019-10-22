const os = require("os");
var moment = require("moment");
const path = require("path")
const { workspace, window, ViewColumn, Uri } = require("vscode");
import { humanizeMinutes } from "./data";
import { getKarma } from "./karma";
const fs = require("fs");

let fileDuration = [];
let todayCodingTime = 0;
let file = getDashboardFile();
let JSONFile = getJSONFile();

let dashboardContent = `HabitScript Dashboard`;


export function isWindows() {
  return process.platform.indexOf("win32") !== -1;
}

export function getDashboardFile() {
  const homedir = os.homedir();
  let dashboardFile  = path.join(homedir, "habitScript.txt")
 return dashboardFile
}

export function getJSONFile() {
  const homedir = os.homedir();
  let jsonFile = path.join(homedir, "habitScript.json")
  return jsonFile;
}

export function addDashboardContent() {




  fs.exists(JSONFile, function(exists) {
  if (exists) {
    let data = fs.readFileSync(JSONFile);
    console.log("The file has been readed!");

    // @ts-ignore
    fileDuration = JSON.parse(data);

  console.log(fileDuration.length, "Offline Dashboard")
  dashboardContent += "\n\n";
  dashboardContent += `Today Coding Time:  ${humanizeMinutes(
    getTodayCodingTime(fileDuration)
  )}`;
  dashboardContent += "\n\n";
  dashboardContent += `Earned Karmas:  ${getKarma(getTodayCodingTime(fileDuration))}`;
  dashboardContent += "\n\n";
  dashboardContent += `Most Productive Day:  ${humanizeDate(
    getMostProductiveDay(fileDuration)
  )}`;
  dashboardContent += "\n\n";
 
  dashboardContent += "\n\n";
  dashboardContent += `Most Used Programming Language:  ${getMostUsedLanguage(
    fileDuration
  )}`;
  dashboardContent += "\n\n";
  dashboardContent += "\n\n";
  sortFileByDuration(fileDuration, new Date()).forEach(el => {
    dashboardContent += "\n\n";

    dashboardContent += `File Path: ${el.projectName}/${el.folderName}/${el.fileName} Coding Time: ${humanizeMinutes(el.duration)}`;
    dashboardContent += "\n\n";
  });
  dashboardContent += "\n\n";

  
 // @ts-ignore
 fs.writeFile(file, dashboardContent, function (err) {
  if (err) {
  console.log(err)
  }
})

  }
  else {
     // @ts-ignore
   fs.writeFile(file, dashboardContent, function (err) {
    if (err) {
    console.log(err)
    }
  })
  }
});

}

// Format Date
export function getDateFormat(date) {
  return moment(date).format("MM-DD-YYYY");
}

export function humanizeDate(date) {
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
function getMostUsedLanguage(durations, date) {
 // console.log(durations)
  const highest = durations.sort((a, b) => b.duration - a.duration)[0];

  return highest.language;
}

// Sort File Name By Duration
function sortFileByDuration(durations, date) {
 // console.log(durations)

  const highest = durations.sort((a, b) => b.duration - a.duration);

  return highest;
}

// Get Week Dates By Date
function getWeekByDate(date) {
  
  let curr = date 
let week = []

for (let i = 1; i <= 7; i++) {
  let first = curr.getDate() - curr.getDay() + i 
  let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
  week.push(day)
}
return week
}
// Get Most Productive Day in the Week
function getMostProductiveDay(durations) {
 
  const weekDates = getWeekByDate(new Date)
  const weekActivity = durations.filter((el => {
   return  new Date(el.created_at).getTime() >= new Date(weekDates[0]).getTime() &&    new Date(el.created_at).getTime() <= new Date(weekDates[weekDates.length-1]).getTime()
  }))
  console.log(weekActivity)
  const highest = weekActivity.sort((a, b) => b.duration - a.duration)[0];

  return highest.created_at;
}


export function openDashboardFile () {

 
  const filePath = Uri.parse(file)
 
  workspace.openTextDocument(filePath).then(doc => {

    window.showTextDocument(doc, 1, false).then(e => {
       console.log(e)
    });
});
/*

        workspace.openTextDocument(file)


          .then(
            (doc) => { 

              console.log(doc , doc === null, doc === undefined)

             if(doc === undefined ||  doc === null) {
               openDashboardFile()
             }
             else {
              window.showTextDocument(doc, ViewColumn.One, false).then(
                (e) => { 
    
                  if(e === null ||   e === undefined) {
                    openDashboardFile()
                  }
               console.log(e , e === null, e === undefined)
               
              }, 
                (err) => { 
                  console.log(err)
                  openDashboardFile()
                 })
             }
          
          }, 
            (err) => { 
              console.log(err)
              openDashboardFile()
             })
          // only focus if it's not already open
         
   
*/
}


 
