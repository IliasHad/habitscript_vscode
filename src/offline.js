const fs = require("fs");
import { getJSONFile, getDateFormat } from "./dashboard";


export function serverIsDown(fileDuration) {
  createJsonFile(fileDuration);
}

// When Connection Isn't Available we Store Data in JSON File
let durationsArr = [];
let file = getJSONFile();

export function createJsonFile(fileDuration) {
  fs.exists(file, function(exists) {
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

    
    else {
      fs.writeFile(file, JSON.stringify(fileDuration), err => {
        if (err) throw err;
        console.log("The file has been saved!");
      });
    }
  });
 
  };
 

 

  function checkAndAddFile(fileDuration) {
    if (durationsArr.length > 0) {
      durationsArr.forEach(el => {
        fileDuration.forEach(duration => {
          // Update exciting file with new duration
console.log(getDateFormat(el.created_at) === getDateFormat(new Date()))
          if (
            el.fileName === duration.fileName &&
            getDateFormat(el.created_at) === getDateFormat(new Date())
          ) {
            el.duration += duration.duration;
          } else {
            // Add Duration when filename doesn't excists in json file

            durationsArr.push({
              projectName: duration.projectName,
              duration: duration.duration,
              fileName: duration.fileName,
              created_at: duration.created_at,
              language: duration.language
            });
          }
        });
      });
    } else {
      // add file duration array when we don't have in json file
      durationsArr.push(fileDuration);
    }
   
  }

