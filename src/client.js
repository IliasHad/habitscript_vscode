const fetch = require('node-fetch').default
const apiEndpoint = require("./config");
import vscode from "vscode"
const fs = require("fs");
const path = require("path")

import { serverIsDown } from "./offline";
import { getJSONFile } from "./dashboard";
import { getApikey } from "./login";
import {isWindows} from "./dashboard"


const os = require("os");
let lastSendingData = Date.now()
let settingsFile = getSettingsFile()

export function checkIfUserHasLogged() {

  let isUserLogged = false

  console.log(settingsFile, "File Path")
 // Check if file exist
fs.exists(settingsFile, function (file) {
  console.log(file)
  if (file) {
  isUserLogged = true

console.log(isBestTimeToSend(),"Best Time To Send")
 if(isBestTimeToSend(Date.now())) {
   sendData()
 }

  }
 
 
})
}
export function getSettingsFile() {
  const homedir = os.homedir();
  let settingFilePath = path.join(homedir, "habitScriptSettings.json")
  return  settingFilePath;
}

export function isBestTimeToSend(now) {
 
  return lastSendingData + 120000 < now;
}
export function sendData() {
  let file = getJSONFile();
  let fileDuration = [];
  let data = fs.readFileSync(file);
  let settingsData = fs.readFileSync(settingsFile);

  // @ts-ignore
  fileDuration = JSON.parse(data);

  let url = `${apiEndpoint}duration`;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//console.log(fileDuration)
  console.log(url, new Date().toISOString());
  // @ts-ignore
  let settingsDataObject = JSON.parse(settingsData)
    // @ts-ignore
  console.log(settingsDataObject.apiKey)
  let body = {
    fileDuration,
    apiKey:settingsDataObject.apiKey,
    timeZone
  };
    // @ts-ignore
     fetch(url, {
      method: "POST",
      // @ts-ignore
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    })
 
    .then(data => {
      data.json()
     
    })
    .then(response => {
      console.log(data);
      lastSendingData = Date.now();
    })
    .catch(err => {
      console.log(err);
      // serverIsDown();
    });
}

// Check API Is Valid
export function checkApi(apiKey) {
  console.log("CHeck Api");

  let url = `${apiEndpoint}duration/u/${apiKey}`;
  console.log(url);

  let editors = {
    name: "vs_code",
    connected_at: new Date().toISOString()
  };
  let isValid;
  // @ts-ignore
  fetch(url, {
    method: "POST",
    body: JSON.stringify(editors),
    headers: { "Content-Type": "application/json" }
  })
    .then(response => {
      return response.json();
    })
    .then(resData => {
      console.log(resData);
      if (resData !== undefined) {
        fs.writeFile(settingsFile, JSON.stringify({apiKey}), err => {
          if (err) console.log(err);
          console.log("The file has been saved!");
        });
                vscode.window.showInformationMessage(
          "Congratulations, HabitScript is now active!"
        );
      } else {
        vscode.window.showInformationMessage("Oops, API Key is not valid!");

        getApikey();
      }
    })

    .catch(err => {
      getApikey();
      console.log(err);
    });

  return isValid;
}



