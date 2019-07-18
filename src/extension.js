// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

import { getTodayCodingTime, showTodayTime, onSave } from "./data.js";
import { registerCommands } from "./commands";

export let statusBar = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left
);
export let fileDuration = [];



/**
 * @param {vscode.ExtensionContext} context
 */




export function activate(context) {
  console.log("Habit script activated");
 
 

  // Initialise the Extension
  initialise();

  function initialise() {
    statusBar.text = "Start Tracking";
    statusBar.show();
 
  
    
    getTodayCodingTime();
    showTodayTime();
  }

  // When You Type Anything
  vscode.workspace.onDidChangeTextDocument(doc => {
    onSave(false, doc);
  });

  // When You Saved a File
  vscode.workspace.onDidSaveTextDocument(doc => {
    onSave(true, doc);
  });

  // add the player commands
  context.subscriptions.push(registerCommands());
 

  function updateState (api) {
 
    //  return contextVs.update("apiKey", api);
      } 
    
   
 
}



// this method is called when your extension is deactivated
export function deactivate() {}

