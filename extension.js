// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

import {onEvent} from "./src/data"
import {checkApi, getApikeyValue} from "./src/client"

/**
 * @param {vscode.ExtensionContext} context
 */


 let  context
export function activate(context) {
	
	
		

	initialise()
		

	// When You Type Anything
	vscode.workspace.onDidChangeTextDocument((doc) => {
		onEvent(true, doc);

	  });

	  // When You Saved a File
	  vscode.workspace.onDidSaveTextDocument((doc) => {
		onEvent(false, doc);
		

	  });




		function initialise() {
			statusBar.text = 'Codabits Initalizing ...'
			statusBar.show();
			if(context.globalState.get('apiKey') === undefined ) {
				getApikey()
			}
			
		

		}



	}
	

		  // Show  Input Box to get API Key
 export function getApikey(){

	

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
				checkApi(context)
				getApikeyValue(context)

				const apiKey = context.globalState.get('apiKey');
		  }
			  else {
				vscode.window.showInformationMessage('Oops, API Key is not valid!');

				  getApikey()
			  }
			 })

		  }







		  export let statusBar =   vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

		






// this method is called when your extension is deactivated
export function deactivate() {}


