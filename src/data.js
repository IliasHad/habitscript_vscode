import vscode from "vscode";
const path = require('path');
const fs = require('fs');


// Import Necessary Function
import {sendData} from './client'
import {DEFAULT_DURATION_MILLIS} from './constants'
import {statusBar} from "../extension"

// Gloabl Variables
let codingTime = 0 ;
let lastFileName;
let todayCodingTime;
let fileDuration = [];
let sessionSummaryData = {
		currentDayMinutes: 0,
		currentDayMinutesTime: 0
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
        const language = doc.document.languageId;
        return language;

    }


// Get File Name When Saved Document
function getFileName(doc){
        const filePath = doc.document.fileName;
        const fileName = path.basename(filePath);
        return fileName;
    }


// When You Write Code
export function onEvent (isChanged, doc) {


        

        if(isChanged) {
            const fileName = getFileName(doc);
            const projectName = getProjectName();
            const language = getLanguage(doc);
            let lastTimeSaved;
            getCodingTime()
            let lastFileNameChanged = lastFileName
        

    

            // Check If Last Saved File Excists in FilDuration Array 

            function checkLastSaved() {
                let isExcist = false;

                fileDuration.forEach(el => {
                    
                    if(el.fileName === lastFileNameChanged) {
                        isExcist = true
                    }

                
                    
                })
                return isExcist;
            }
            // Check if array is not empty and fileName and lastFilename are the same
            if(fileDuration.length > 0 && checkLastSaved()) {

                fileDuration.forEach(el => {
                

        
                    if(el.fileName === lastFileNameChanged) {

                        const pastDurations = el.duration;
                        const newDurations = pastDurations + 1;
                        el.duration = newDurations
                        el.created_at=new Date().toISOString();
                        lastFileName = fileName;
                        lastTimeSaved = Date.now()
                
                    }

        
                })
            
            
            }

            // Check if array is not empty and fileName and lastFilename aren't the same

            // Push New File to FileDuration Array

            else if(fileDuration.length > 0 && !checkLastSaved()) {

        
                //console.log(!checkLastSaved())
                //console.log('Hi From Checking')
            
                fileDuration.push({
                    fileName,
                    duration:1,
                    created_at: new Date().toISOString(), 
                    projectName, 
                    language
                })

            
                lastTimeSaved = Date.now()
            }

        // Check if array is  empty and fileName and lastFilename are the same or aren't the same

            else if(fileDuration.length <= 0) {

                fileDuration.push({
                    fileName,
                    duration:1,
                    created_at: new Date().toISOString(), 
                    projectName, 
                    language
                })
                lastFileName = fileName;
                lastTimeSaved = Date.now()

            }

                
        
            
        //	console.log(fileDuration);

   
        
        setTimeout(() => {
        
                vscode.window.showInformationMessage("We Sending Data");

                sendData(fileDuration);
        
        },120000)

        
        
        
            }
        

                    

            
        
            
}



export function getCodingTime() {
    let date = new Date();
    date = new Date(date.getTime() - DEFAULT_DURATION_MILLIS);
    // offset is the minutes from GMT.
    // it's positive if it's before, and negative after
    const offset = date.getTimezoneOffset();
    const offset_sec = offset * 60;
    let start = Math.round(date.getTime() / 1000);
    // subtract the offset_sec (it'll be positive before utc and negative after utc)
    let local_start = start - offset_sec;
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    incrementSessionSummaryData(1); //secondes
    }
    
 export function incrementSessionSummaryData(secondes){
        sessionSummaryData.currentDayMinutes += secondes;
        statusBar.text =  `🙌 ${humanizeMinutes(getTodayCodingTime())} `;
    }
    
    
    
export function humanizeMinutes(sec) {
    
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
    
        
    
    
    
    
export  function getDateFormat(date) {
            const dd = new Date(date).getDate();
            const mm = new Date(date).getMonth() + 1;
            const yy = new Date(date).getFullYear();
            return `${mm}-${dd}-${yy}`
        }
    


function getTodayCodingTime() {

            let todayTime;
            fileDuration.forEach(el => {
                if(getDateFormat(el.created_at) === getDateFormat(new Date().toISOString()))
                todayTime = el.duration + el.duration
            })
            return todayTime
        }
        

// Offline Storage

// When Connection Isn't Available we Store Data in JSON File

export function createJsonFile () {
	
	let data = JSON.stringify(fileDuration);  
	fs.writeFileSync('coding_time.json', data);  

}

// When Connection IsAvailable we read  json file and then send it to database

export function readJsonFile()  {
	let dataJSON = fs.readFileSync('coding_time.json');  
	// @ts-ignore
	let dataObj = JSON.parse(dataJSON);  
}
