const fs = require("fs");
import { getJSONFile } from "./dashboard";
export function serverIsDown(fileDuration) {
  createJsonFile(fileDuration);
}

// When Connection Isn't Available we Store Data in JSON File

export function createJsonFile(fileDuration) {
  let file = getJSONFile();
  fs.writeFile(file, JSON.stringify(fileDuration), err => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  let durationsArr = [];
  fs.exists(file, function(exists) {
    if (exists) {
      let data = fs.readFileSync(file);

      // @ts-ignore
      durationsArr = JSON.parse(data);
      checkAndAddFile(fileDuration);
    }
  });

  // Format Date
  function getDateFormat(date) {
    const dd = new Date(date).getDate();
    const mm = new Date(date).getMonth() + 1;
    const yy = new Date(date).getFullYear();
    return `${mm}-${dd}-${yy}`;
  }

  function checkAndAddFile(fileDuration) {
    if (durationsArr.length > 0) {
      durationsArr.forEach(el => {
        fileDuration.forEach(duration => {
          // Update exciting file with new duration

          if (
            el.fileName === duration.fileName &&
            getDateFormat(el.created_at) === getDateFormat(new Date())
          ) {
            el.duration = duration.duration;
          } else {
            // Add Duration when filename doesn't excists in json file

            durationsArr.push({
              projectName: duration.projectName,
              duration: duration.duration,
              fileName: duration.fileName,
              created_at: duration.created_at
            });
          }
        });
      });
    } else {
      // add file duration array when we don't have in json file
      durationsArr.push(fileDuration);
    }
  }
}
