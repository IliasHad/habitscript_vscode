const os = require("os");
var moment = require("moment");

const { workspace, window, ViewColumn } = require("vscode");
import { humanizeMinutes } from "./data";
import { getKarma } from "./karma";
const fs = require("fs");

let fileDuration = [];
let todayCodingTime = 0;
let file = getDashboardFile();
let JSONFile = getJSONFile();

let dashboardContent = `HabitScript Dashboard`;


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

export function addDashboardContent() {




  fs.exists(JSONFile, function(exists) {
  if (exists) {
    let data = fs.readFileSync(JSONFile);
    console.log("The file has been readed!");

    // @ts-ignore
    fileDuration = JSON.parse(data);

   console.log(fileDuration)
  dashboardContent += "\n\n";
  dashboardContent += `Today Coding Time:  ${humanizeMinutes(
    getTodayCodingTime(fileDuration)
  )}`;
  dashboardContent += "\n\n";
  dashboardContent += `Earned Karmas:  ${getKarma(fileDuration)}`;
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
  dashboardContent += `File Name  ${humanizeDate(new Date())}`;
  dashboardContent += "\n\n";
  sortFileByDuration(fileDuration, new Date()).forEach(el => {
    dashboardContent += `File Name: ${
      el.fileName
    }  Coding Time: ${humanizeMinutes(el.duration)} Project Name: ${el.projectName}`;
    dashboardContent += "\n\n";
  });
  dashboardContent += "\n\n";

  dashboardContent += `Language  ${humanizeDate(new Date())}`;
  dashboardContent += "\n\n";
  sortLanguageByDuration(fileDuration, new Date()).forEach(el => {
    dashboardContent += `Language: ${
      el.language
    }  Coding Time: ${humanizeMinutes(el.duration)}`;
    dashboardContent += "\n\n";
  });

  
 // @ts-ignore
 fs.writeFile(file, dashboardContent, "UTF-8", function (err) {
  if (err) {
  console.log(err)
  }
})

  }
  else {
     // @ts-ignore
   fs.writeFile(file, dashboardContent, "UTF-8", function (err) {
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

// Get Most Productive Day in the Week
function getMostProductiveDay(durations) {
  console.log(durations)
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
function getMostUsedLanguage(durations, date) {
  console.log(durations)
  const highest = durations.sort((a, b) => b.duration - a.duration)[0];

  return highest.language;
}

// Sort File Name By Duration
function sortFileByDuration(durations, date) {
  console.log(durations)

  const highest = durations.sort((a, b) => b.duration - a.duration);

  return highest;
}
function sortLanguageByDuration(durations, day) {

  let array = []
  const date = durations.filter(el => getDateFormat(el.created_at) === getDateFormat(day))

  /*
  date.reduce((prev, item )=> {

    console.log(prev.language, item.language)

    if(prev.language === item.language) {

      const newDuration = prev.duration + item.duration
      item.duration = newDuration
      console.log(newDuration)
      array.push({
        fileName: item.fileNmae,
        duration: newDuration,
        language: item.language,
        created_at: item.created_at,
        projectName: item.projectName
      })
    }

    else {
      array.push({
        fileName: item.fileNmae,
        duration: item.duration,
        language: item.language,
        created_at: item.created_at,
        projectName: item.projectName
      })
    }
    return item
  })
 */
  const highest = date.sort((a, b) => b.duration - a.duration);

  return highest;
}





export function openDashboardFile () {

 


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
         
   

}


 
