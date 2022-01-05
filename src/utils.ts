import * as vscode from "vscode";
import * as child from "child_process";

export const getWorkspaces = () => {
  return vscode.workspace.workspaceFolders;
};

export const isRunning = () => {
  const cmd = (() => {
    switch (process.platform) {
      case "win32":
        return "tasklist";
      case "darwin":
        return `ps -ax | grep dura`;
      case "linux":
        return "ps -A";
      default:
        throw new Error("Invalid OS");
    }
  })();

  return new Promise((resolve, reject) => {
    require("child_process").exec(
      cmd,
      (err: Error, stdout: string, stderr: string) => {
        if (err) {
          reject(err);
        }
        resolve(stdout.toLowerCase().indexOf("dura".toLowerCase()) > 1);
      }
    );
  });
};
