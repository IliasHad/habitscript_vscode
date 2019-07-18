import { commands, Disposable } from "vscode";

import { openDashboardFile } from "./dashboard";
import { isLogin } from "./login";
export function registerCommands() {
  let cmds = [];

  let openDashboard = commands.registerCommand(
    "extension.openDashboard",
    openDashboardFile
  );
  let login = commands.registerCommand("extension.auth", isLogin);
  cmds.push(openDashboard, login);
  return Disposable.from(...cmds);
}
