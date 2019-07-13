// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');



import {getTodayCodingTime,showTodayTime,onSave} from "./data.js"

import {checkApi} from "./client";

export    let statusBar =   vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
export 	let fileDuration = [];

/**
 * @param {vscode.ExtensionContext} context
 */

export let context
export function activate(context) {

	console.log('Habit script activated')
	
	

// Initialise the Extension
	initialise();

		function initialise() {
			statusBar.text = "Start Tracking"
			statusBar.show();
			if(context.globalState.get('apiKey') === undefined || context.globalState.get('apiKey') === null ) {
				getApikey(context)
			}
		
			getTodayCodingTime()
			showTodayTime()
			
		

		}
		
			

	// When You Type Anything
			vscode.workspace.onDidChangeTextDocument((doc) => {
				onSave(false, doc);

		  });

		  // When You Saved a File
		  vscode.workspace.onDidSaveTextDocument((doc) => {
			 
			onSave(true, doc);
			

		  });


	}


		  // Show  Input Box to get API Key
		  export 	  function getApikey(context){



			// Prompt Input To Get API Key 
			let promptOptions = {
				prompt: 'CodaHabits API Key',
				placeHolder: 'Enter your API key',
				value: '',
				ignoreFocusOut: true
			  };
		
			 vscode.window.showInputBox(promptOptions)
			 .then( (API) =>  {
			
		
			  if(API !== null || API !== undefined ) { 

				context.globalState.update('apiKey', API);
				checkApi()
		  }
			  else {
				vscode.window.showInformationMessage('Oops, API Key is not valid!');

				  getApikey()
			  }
			 })

		  }


// this method is called when your extension is deactivated
export function deactivate() {}

