const vscode = require("vscode");
let path = require("path");
const fs = require("fs");
import { getJSONFile, getDateFormat,   addDashboardContent } from "./dashboard";
import { statusBar, fileDuration } from "./extension";
import { sendData, checkIfUserHasLogged } from "./client";
import { createJsonFile } from "./offline";
import { getKarma } from "./karma";
const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

// Gloabl Variables
let lastFileName;
let lastFolderName;
let lastProjectName;
let todayCodingTime = 0;
let lastTimeSaved = Date.now();
let JSONFile = getJSONFile();
let changeTime = 0;

let fileDurationJSON = [];

export function getTodayCodingTime() {
  let exists = fs.existsSync(JSONFile);
  if (exists) {
    let data = fs.readFileSync(JSONFile);
    console.log("The file has been readed!");

    // @ts-ignore
    fileDurationJSON = JSON.parse(data);
  }

  let total = 0;

  fileDurationJSON.forEach(el => {
    if (getDateFormat(el.created_at) === getDateFormat(new Date())) {
      total += el.duration;
    }
  });

  todayCodingTime = total;

  return todayCodingTime;
}

// Get Project Name
const getProjectName = () => {
  let editor = vscode.window.activeTextEditor;
  if (editor) {
    let doc = editor.document;
    if (doc) {
      let file = doc.fileName;
      
      let uri = vscode.Uri.file(file);
      let workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
      let projectName = workspaceFolder.name;

      return projectName;
    }
  }
};

// Get Language Used When Saved Document
const getLanguage = doc => {
  const language = doc.languageId;
  return language;
};

// Get File Name When Saved Document
function getFileName(doc) {
  const filePath = doc.fileName;
  const fileName = path.basename(filePath);
  return fileName;
}
// Get File Name When Saved Document
function getFolderName(doc) {
  const filePath = doc.fileName;
  const folderName = path.dirname(filePath);
  const folderPath = folderName.split("\\")
  //console.log(folderPath[folderPath.length-1])
  return folderPath[folderPath.length-1]
}
export function showTodayTime() {
  statusBar.text = `Today ${humanizeMinutes(todayCodingTime)}  |  🎉 ${getKarma(
    todayCodingTime
  )} karma`;
}

export function humanizeMinutes(ms) {
  return moment.duration(ms, "milliseconds").format("h [hrs], m [min]");
}

export function getHours(date) {
  return moment(date).format("hh");
}
export function onSave(isSaved, doc) {
 

  changeTime += Date.now() - lastTimeSaved

  console.log("Change Time", changeTime, Date.now() - lastTimeSaved)
  lastTimeSaved = Date.now()

  const fileName = getFileName(doc);
  const projectName = getProjectName();
  const language = getLanguage(doc);
  const folderName= getFolderName(doc);

 
 
  // Check If Last Saved File Excists in FilDuration Array

  let isExcited = fileDuration.filter(el => {

    console.log(getHours(el.created_at), getHours(new Date()))
    return el.fileName === lastFileName && el.folderName === lastFolderName && getDateFormat(el.created_at) === getDateFormat(new Date()) && el.projectName === lastProjectName && getHours(el.created_at) === getHours(new Date())
   
  });

  
  if (isSaved) {
    // Check if array is not empty and fileName and lastFilename are the same
    // @ts-ignore
    console.log("Exciting Array Lenght",isExcited.length)

    console.log(doc)
    if (fileDuration.length > 0 && isExcited.length > 0) {

    

      var foundIndex = fileDuration.findIndex(el => {
        return el.fileName === lastFileName && el.folderName === lastFolderName && getDateFormat(el.created_at) === getDateFormat(new Date()) && el.projectName === lastProjectName && getHours(el.created_at) === getHours(new Date())
       
      });

     console.log("Index Of Founded Item",foundIndex)
     console.log(fileDuration[foundIndex])
          const pastDurations = fileDuration[foundIndex].duration;
          const newDurations = pastDurations + changeTime
          fileDuration[foundIndex].duration = newDurations;
          changeTime = 0
        
      
    }

    // Check if array is not empty and fileName and lastFilename aren't the same

    // Push New File to FileDuration Array

    // @ts-ignore
   
    

    // Check if array is  empty and fileName and lastFilename are the same or aren't the same
    else {
      fileDuration.push({
        fileName,
        duration: changeTime,
        created_at: new Date().toISOString(),
        projectName,
        language,
        folderName
      });

      changeTime = 0
    }

    //	console.log(fileDuration)

    console.log("Before Creating Json File....");
    createJsonFile(fileDuration);

    getTodayCodingTime();
    showTodayTime();
    let now = Date.now();
   

console.log(checkIfUserHasLogged(),"Checking User")
    // Sending Data to Server but after user enter the api key

   

    
    addDashboardContent()


   

  }

  lastFileName = fileName;
  lastFolderName = folderName
  lastProjectName = projectName;
  console.log(lastTimeSaved, lastFileName, lastFolderName, lastProjectName)

}
