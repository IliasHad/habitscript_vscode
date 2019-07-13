
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter);



// Set some defaults (required if your JSON file is empty)
db.defaults({ fileDuration: []})
.write()


export function serverIsDown(fileDuration) {
	createJsonFile(fileDuration)
	
}



// When Connection Isn't Available we Store Data in JSON File

function createJsonFile (fileDuration)  {
	

db.set('fileDuration', fileDuration)
.write()

let fileDurationDB = db.get('fileDuration')

console.log(fileDurationDB)
}

// When Connection IsAvailable we read  json file and then send it to database






