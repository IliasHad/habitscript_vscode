const fs = require("fs");
import { getJSONFile, getDateFormat} from "./dashboard";
import {sendData} from "./client"
import {getTodayCodingTime, showTodayTime, getHours} from "./data"
export function serverIsDown(fileDuration) {
  createJsonFile(fileDuration);
}

// When Connection Isn't Available we Store Data in JSON File
let file = getJSONFile();
let codingActivity = []
export function createJsonFile(fileDuration) {
  console.log("Creating JSON File...");
  let exists = fs.existsSync(file);

  console.log("JSON file Excists", exists)
    if (exists) {
      let data = fs.readFileSync(file);

      // @ts-ignore
     let durationsArr = JSON.parse(data);

      checkAndAddFile(fileDuration, durationsArr);


     console.log(codingActivity)
      fs.writeFile(file, JSON.stringify(codingActivity), err => {
        if (err) console.log(err);
        console.log("The file has been saved!");
      });
    }
    // If json doesn't exicst
    else {
      fs.writeFile(file, JSON.stringify(fileDuration), err => {
        if (err) throw err;
        console.log("The file has been saved! When doesn't exicst");
      });
    }
  
}

function checkAndAddFile(fileDuration, durationsArr) {
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
        
        return i.fileName === item.fileName && i.folderName === item.folderName && i.projectName === item.projectName   && getDateFormat(item.created_at) === getDateFormat(i.created_at) &&  getHours(item.created_at) ===  getHours(i.created_at)

      });
      if (newItem) {
     
        const newDuration = newItem.duration + item.duration;
        Object.assign(newItem.duration, newDuration);
      } else {
        prev.push(item);
      }
      return prev;
    }, []);

 codingActivity = result;

  } else {
    // add file duration array when we don't have in json file
    codingActivity = fileDuration;
  }
  
 // sendData()
  getTodayCodingTime();
  showTodayTime();
}
