const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);


export function getKarma(fileDuration) {

    let  codingPoints = 0;
    let  totalCodingTime = 0;
       fileDuration.forEach(el => {
          totalCodingTime =  el.duration +   el.duration
   
        })
           // Convert Coding Time From Secondes to Hours
           let CodingTimeInMinutes = convertMsToMinutes(totalCodingTime);
        
           // Every 2 Minutes is counted as 1 Karma
        //console.log( Math.round(parseInt(CodingTimeInMinutes) * 0.5))
         // @ts-ignore
         codingPoints = Math.round(parseInt(CodingTimeInMinutes) * 0.5)
      
         return codingPoints
         

     
}
function convertMsToMinutes(ms) {
   
    return moment.duration(ms, "milliseconds").format("m");

}