 // The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
let path = require('path');

		// Gloabl Variables
		let lastFileName;
		let todayCodingTime = 0;
		let lastTimeSaved = 0;
	
		
import {statusBar,fileDuration} from "./extension";

import {sendData} from "./client";


export function getTodayCodingTime() {
            let total = 0;
        
        
            fileDuration.forEach((el) => {
        
                if(getDateFormat(el.created_at) === getDateFormat(new Date().toISOString()))
                {
                     total += el.duration
        
            
                }
            
            })
        
            todayCodingTime = total
            return todayCodingTime
        }

        function getDateFormat(date) {
            const dd = new Date(date).getDate();
            const mm = new Date(date).getMonth() + 1;
            const yy = new Date(date).getFullYear();
            return `${mm}-${dd}-${yy}`
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
		}

		// Get Language Used When Saved Document
		const getLanguage = (doc) =>  {
			const language = doc.languageId;
			return language;

		}

	
		// Get File Name When Saved Document
		function getFileName(doc){
			const filePath = doc.fileName;
			const fileName = path.basename(filePath);
			return fileName;
		}

export function showTodayTime() {
			statusBar.text = `Today ${humanizeMinutes(todayCodingTime)}`
		}
 
 
function humanizeMinutes (sec) {

    // convert Secondes to Minutes
    let min = sec / 60; 
    min = min || 0;
    let str = "";
    if (min === 1) {
        
        str = "1 min";
    }
    else if (min === 60) {
        str = "1 hr";
    } else if (min > 60) {
        let hrs = min / 60;
        if (hrs % 1 === 0) {
            str = hrs.toFixed(0) + " hrs";
        } else {
            str = (Math.round(hrs * 10) / 10).toFixed(1) + " hrs";
        }
    } else  {
        // less than 60 seconds
        str = min.toFixed(0) + " min";
    }
    return str;
    }
 
 
 
 
 // When You Write Code
 export function onSave(isSaved,doc) {
		


    if(lastTimeSaved === 0) {
        lastTimeSaved = Date.now()
    }

    getTodayCodingTime()
    showTodayTime()
    
    
        const fileName = getFileName(doc);
        const projectName = getProjectName();
        const language = getLanguage(doc);
    
        lastFileName = fileName;
    

    
    
    
        // Check If Last Saved File Excists in FilDuration Array 

    
    
            let isExcited = false
         fileDuration.forEach(el => {

                if(el.fileName === lastFileName) {
                    isExcited = true
                
                }
                
            })
            
        if(isSaved) {

    
        // Check if array is not empty and fileName and lastFilename are the same
        // @ts-ignore
        if(fileDuration.length > 0 && isExcited === true) {

            fileDuration.forEach(el => {
            

    
                if(el.fileName === lastFileName) {


                    const pastDurations = el.duration;
                    const newDurations = pastDurations + (( Date.now() - lastTimeSaved ) / 1000);
                    el.duration = newDurations
                    el.created_at=new Date().toISOString();
                
                
                
            
                }

    
            })
        
        
        }

        // Check if array is not empty and fileName and lastFilename aren't the same

        // Push New File to FileDuration Array

        // @ts-ignore
        else if(fileDuration.length > 0 && isExcited === false) {

    
            //console.log(!checkLastSaved())
            //console.log('Hi From Checking')
        
            fileDuration.push({
                fileName,
                duration:( Date.now() - lastTimeSaved ) / 1000,
                created_at: new Date().toISOString(), 
                projectName, 
                language
            })

        
        
            
        }

    // Check if array is  empty and fileName and lastFilename are the same or aren't the same

        else if(fileDuration.length <= 0) {

            fileDuration.push({
                fileName,
                duration:( Date.now() - lastTimeSaved ) / 1000,
                created_at: new Date().toISOString(), 
                projectName, 
                language
            })
        
        
        
        }

            

//	console.log(fileDuration)
    console.log(todayCodingTime)


    
   setTimeout(sendData, 300000)
    
   
    

}


    lastTimeSaved = Date.now()
    
        
    }