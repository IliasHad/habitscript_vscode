const vscode = require("vscode");
import { checkApi } from "./client";


export function isLogin(context) {
function updateState (api) {
 
    return context.globalState.update("apiKey", api);
      } 
    
     function getState () {
    return  context.globalState.get("apiKey");
    
      }
      getApikey()
   
     
}
// Show  Input Box to get API Key
export function getApikey() {

 
  // Prompt Input To Get API Key
  let promptOptions = {
    prompt: "HabitScript API Key",
    placeHolder: "Enter your API key",
    value: "",
    ignoreFocusOut: true
  };

  vscode.window.showInputBox(promptOptions).then(API => {
    if (API !== null || API !== undefined) {
  //    context.globalState.update("apiKey", API);
      checkApi();
    } else {
      vscode.window.showInformationMessage("Oops, API Key is not valid!");

      getApikey();
    }
  });
}
