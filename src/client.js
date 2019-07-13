
const fetch = require('node-fetch');
const apiEndpoint = require('./config');
const vscode = require('vscode');

import {
    statusBar,
    getApikey,
    context
}from "./extension";

import {
    serverIsDown
} from "./offline"

let lastSendingData = 0;


export function sendData(fileDuration, context)  {
	const apiKey = context.globalState.get('apiKey');

	
	let url = `${apiEndpoint}duration/${apiKey}`;
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	
	console.log(url)


	async function sendPost() {
	
		// @ts-ignore
  let response = await fetch(url, {
	method: 'POST',
	// @ts-ignore
	body: JSON.stringify({
		fileDuration: fileDuration,
		timeZone
	}),
	headers: { 'Content-Type': 'application/json' }

  });
  let data = await response.json()
  return data;
}


sendPost()

	
	  .then(data => {
		  console.log(data);
		  lastSendingData = Date.now();

		  statusBar.tooltip = `We send Data to Our Server in ${new Date(lastSendingData)}`;


	  })
	  .catch(err => {
		  console.log(err)
		 serverIsDown();
	  })
	
	  
	  


		}
		


        // Check API Is Valid 
export function checkApi()  {
					const apiKey = context.globalState.get('apiKey');

					let url = `${apiEndpoint}duration/u/${apiKey}`
					console.log(url)
	  
					let editors = {
						name: "vs_code",
						connected_at: new Date().toISOString()
					}
					let isValid ;
		// @ts-ignore
	fetch(url, {

		method: 'POST',
		body: JSON.stringify(editors),
        headers: { 'Content-Type': 'application/json' }
	})
	.then(response=> {
	
		return response.json()
	})
	.then(resData => {
		console.log(resData)
		if(resData !== undefined ){

			vscode.window.showInformationMessage('Congratulations, Codabits is now active!');
		}
		else {
			vscode.window.showInformationMessage('Oops, API Key is not valid!');

			getApikey()
		}
	})

	.catch((err) => {
				getApikey()
		console.log(err)
	})		

	return isValid;
}