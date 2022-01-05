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
  let disposable = vscode.commands.registerCommand(
    "dura-vscode.helloWorld",
    async () => {
      const ls = child.spawn("ls", ["/home/nevin/Desktop"]);

      ls.stdout.on("data", (data) => {
        // console.log(data.toString());
      });

      ls.on("close", (code) => {
        console.log(code);
      });
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from dura-vscode!");
    }
  );

  const checkWorkspaces = () => {
    const workspaces = getWorkspaces();
    if (!workspaces) {
      return;
    }
    console.log(workspaces);
    workspaces.map(async (workspace) => {
      if (!(await dura.isWatched(workspace.uri.path))) {
        vscode.window
          .showInformationMessage(
            `${workspace.uri.path} is not being watched by dura. Would you like to watch it?`,
            "Yes",
            "No",
            "Don't show again"
          )
          .then((result) => {
            if (result === "Yes") {
              dura.watchDir(workspace.uri.path);
            } else {
              return;
            }
          });
      }
    });
  };

  checkWorkspaces();

  if (!(await isRunning())) {
    vscode.window
      .showInformationMessage(
        "dura is not currently running. Would you like to start it?",
        "Yes",
        "No",
        "Automatically Start",
        "Don't show again"
      )
      .then((response) => {
        if (response === "Yes") {
          let exitCode = dura.startDura();
          if (exitCode) {
            // because the exit code is null if dura is running
            vscode.window.showErrorMessage("Failed to start dura");
          }
        } else {
          return;
        }
      });
  }
  console.log(await dura.isWatched("ahsdgh"));
}

// this method is called when your extension is deactivated
export function deactivate() {}
