const vscode = require("vscode");
let path = require("path");
const fs = require("fs");
import { getJSONFile, getDateFormat } from "./dashboard";
import { statusBar, fileDuration } from "./extension";
import { sendData } from "./client";
import { createJsonFile } from "./offline";
import {getKarma} from "./karma"
const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);


// Gloabl Variables
let lastFileName;
let todayCodingTime = 0;
let lastTimeSaved = 0;
let fileDurationJSON = [];
let JSONFile = getJSONFile();

fs.exists(JSONFile, function(exists) {
  if (exists) {
    let data = fs.readFileSync(JSONFile);
    console.log("The file has been readed!");

    // @ts-ignore
    fileDurationJSON = JSON.parse(data);
  }
});

export function getTodayCodingTime() {
  let total = 0;

  fileDurationJSON.forEach(el => {
  
    if (
      getDateFormat(el.created_at) === getDateFormat(new Date())
    ) {
      total += el.duration;
      console.log(total);
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

export function showTodayTime() {
  statusBar.text = `Today ${humanizeMinutes(todayCodingTime)}  |  🎉 ${getKarma(fileDurationJSON)} karma`;

  
}

export function humanizeMinutes(ms) {
  return moment.duration(ms, "milliseconds").format("h [hrs], m [min]");
}



export function onSave(isSaved, doc) {
  if (lastTimeSaved === 0) {
    lastTimeSaved = Date.now();
  }

  const fileName = getFileName(doc);
  const projectName = getProjectName();
  const language = getLanguage(doc);

  lastFileName = fileName;

  // Check If Last Saved File Excists in FilDuration Array

  let isExcited = false;
  fileDuration.forEach(el => {
    if (el.fileName === lastFileName) {
      isExcited = true;
    }
  });

  if (isSaved) {
    // Check if array is not empty and fileName and lastFilename are the same
    // @ts-ignore
    if (fileDuration.length > 0 && isExcited === true) {
      fileDuration.forEach(el => {
        if (el.fileName === lastFileName) {
          const pastDurations = el.duration;
          const newDurations = pastDurations + (Date.now() - lastTimeSaved);
          el.duration = newDurations;
          el.created_at = new Date().toISOString();
        }
      });
    }

    // Check if array is not empty and fileName and lastFilename aren't the same

    // Push New File to FileDuration Array

    // @ts-ignore
    else if (fileDuration.length > 0 && isExcited === false) {
      //console.log(!checkLastSaved())
      //console.log('Hi From Checking')

      fileDuration.push({
        fileName,
        duration: Date.now() - lastTimeSaved,
        created_at: new Date().toISOString(),
        projectName,
        language
      });
    }

    // Check if array is  empty and fileName and lastFilename are the same or aren't the same
    else if (fileDuration.length <= 0) {
      fileDuration.push({
        fileName,
        duration: Date.now() - lastTimeSaved,
        created_at: new Date().toISOString(),
        projectName,
        language
      });
    }

    //	console.log(fileDuration)
    console.log(todayCodingTime);

    createJsonFile(fileDuration);
    //   console.log(fileDuration);
    // console.log(fileDurationInDB)
    getTodayCodingTime();
    showTodayTime();
    setTimeout(sendData, 120000);
 

    /*   const homedir = os.homedir();
  let softwareDataDir = homedir;
   console.log(softwareDataDir)*/
    /* if (isWindows()) {
       softwareDataDir += "\\.software";
   } else {
       softwareDataDir += "/.software";
   }*/
  }

  lastTimeSaved = Date.now();
}
