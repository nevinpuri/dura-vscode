import * as vscode from "vscode";
import * as fs from "fs";
import * as child from "child_process";
import { isRunning } from "../utils";

class DuraWrapper {
  private _ls: child.ChildProcessWithoutNullStreams | undefined;
  private _config: string;
  constructor(config: string) {
    this._config = config;
  }
  public startDura() {
    this._ls = child.spawn("dura", ["serve"]);
    return this._ls.exitCode;
    console.log(this._ls);
  }
  public stopDura() {
    if (!this._ls) {
      throw new Error("no process");
    }
    this._ls.kill("SIGINT");
  }
  private async getConfig() {
    return new Promise<any>((resolve, reject) => {
      fs.readFile(this._config, (err, data) => {
        if (err) {
          reject(err);
        }
        if (data) {
          try {
            resolve(JSON.parse(data.toString()));
          } catch (err: any) {
            reject(err);
          }
        }
      });
    });
  }
  public async isWatched(directory: string) {
    const config = await this.getConfig();
    if (!config) {
      throw Error("No config");
    }

    if (!config.repos) {
      throw Error("No repos in config");
    }

    let repos = Object.keys(config.repos);
    if (repos.length < 1) {
      return false;
    }

    if (!repos.includes(directory)) {
      return false;
    } else {
      return true;
    }
  }
  public async watchDir(directory: string) {
    if (process.platform === "win32") {
      child.exec(`cd ${directory} & dura watch`);
    } else {
      console.log(child.exec(`cd ${directory} && dura watch`));
    }
  }
}

export default DuraWrapper;
