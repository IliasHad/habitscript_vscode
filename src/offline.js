const fs = require("fs");
import { getJSONFile, getDateFormat } from "./dashboard";
import {sendData} from "./client"
export function serverIsDown(fileDuration) {
  createJsonFile(fileDuration);
}

// When Connection Isn't Available we Store Data in JSON File
let durationsArr = [];
let file = getJSONFile();

export function createJsonFile(fileDuration) {
  console.log("Creating JSON File...");
  let exists = fs.existsSync(file);
    if (exists) {
      let data = fs.readFileSync(file);

      // @ts-ignore
      durationsArr = JSON.parse(data);

      checkAndAddFile(fileDuration);

      fs.writeFile(file, JSON.stringify(durationsArr), err => {
        if (err) console.log(err);
        console.log("The file has been saved!");
      });
    }
    // If json doesn't exicst
    else {
      fs.writeFile(file, JSON.stringify(fileDuration), err => {
        if (err) throw err;
        console.log("The file has been saved!");
      });
    }
  
}

function checkAndAddFile(fileDuration) {
  console.log("Checking File....");

  // Intiliase empty array

  // index of duplicate file in the array in JSON file
  let indexOfExciting;
  //let index ;
  console.log(`JSON Array Length ${durationsArr.length}`);

  if (durationsArr.length > 0) {
    let newArr = [];

    
     newArr = fileDuration.concat(durationsArr);

    
    var result = newArr.reduce(function(prev, item) {
      var newItem = prev.find(function(i) {
        
        return i.fileName === item.fileName && i.folderName === item.folderName ;
      });
      if (newItem) {
     
        const newDuration = newItem.duration + item.duration;
        Object.assign(newItem.duration, newDuration);
      } else {
        prev.push(item);
      }
      return prev;
    }, []);

    console.log(result);
    durationsArr = result;
  } else {
    // add file duration array when we don't have in json file
    durationsArr = fileDuration;
  }
  
  sendData()
}
