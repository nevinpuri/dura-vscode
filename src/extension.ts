// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as child from "child_process";
import * as os from "os";
import * as path from "path";
import { getWorkspaces, isRunning } from "./utils";
import DuraWrapper from "./dura/DuraWrapper";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "dura-vscode" is now active!');
  const config = path.join(os.homedir(), "/.config/dura/config.json");
  const dura = new DuraWrapper(config);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  const checkWorkspaces = () => {
    if (
      !vscode.workspace
        .getConfiguration("dura-vscode")
        .get<boolean>("checkWorkspaces")
    ) {
      return;
    }
    const workspaces = getWorkspaces();
    if (!workspaces) {
      return;
    }
    workspaces.map(async (workspace) => {
      if (!(await dura.isWatched(workspace.uri.path))) {
        vscode.window
          .showInformationMessage(
            `${workspace.uri.path} is not being watched by dura. Would you like to watch it?`,
            "Yes",
            "No",
            "Don't show again"
          )
          .then(async (result) => {
            switch (result) {
              case "Yes": {
                await dura.watchDir(workspace.uri.path);
              }
              case "No": {
                return;
              }
              case "Don't show again": {
                vscode.workspace
                  .getConfiguration("dura-vscode")
                  .update("checkWorkspace", false);
              }
              default: {
                return;
              }
            }
          });
      }
    });
  };

  checkWorkspaces();

  if (!(await isRunning())) {
    let start = vscode.workspace
      .getConfiguration("dura-vscode")
      .get<string>("startPrompt");
    console.log(start);
    if (start === "prompt") {
      vscode.window
        .showInformationMessage(
          "dura is not currently running. Would you like to start it?",
          "Yes",
          "No",
          "Auto Start",
          "Don't show again"
        )
        .then((response) => {
          switch (response) {
            case "Yes": {
              dura.startDura();
            }
            case "No": {
              return;
            }
            case "Auto Start": {
              vscode.workspace
                .getConfiguration("dura-vscode")
                .update("startPrompt", "autoStart");
              dura.startDura();
            }
            case "Don't show again": {
              vscode.workspace
                .getConfiguration("dura-vscode")
                .update("startPrompt", "dont-show");
            }
            default: {
              return;
            }
          }
        });
    } else if (start === "autoStart") {
      dura.startDura();
      console.log("auto started dura");
    }
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
