const fetch = require("node-fetch");
const apiEndpoint = require("./config");
const vscode = require("vscode");
const fs = require("fs");

import { statusBar, apiKey, fileDuration } from "./extension";
import { serverIsDown } from "./offline";
import { getJSONFile } from "./dashboard";
import { getApikey } from "./login";
let lastSendingData = 0;

export function sendData() {
  let file = getJSONFile();
  let fileDuration = [];
  let data = fs.readFileSync(file);

  // @ts-ignore
  fileDuration = JSON.parse(data);

  let url = `${apiEndpoint}duration`;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  console.log(url);

  let body = {
    fileDuration,
    apiKey
  };
  async function sendPost() {
    // @ts-ignore
    let response = await fetch(url, {
      method: "POST",
      // @ts-ignore
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
    let data = await response.json();
    return data;
  }

  sendPost()
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
      // serverIsDown();
    });
}

// Check API Is Valid
export function checkApi() {
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
        vscode.window.showInformationMessage(
          "Congratulations, Codabits is now active!"
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
