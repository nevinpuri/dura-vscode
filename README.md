# dura-vscode README

![Demo](https://github.com/Nevin1901/dura-vscode/assets/demo.gif)

A vscode extension which lets you use [dura](https://github.com/tkellogg/dura) from within vscode

## Features

- Automatically launch dura and watch folders from vscode

## TODO

- Show icon at bottom which tells the user if dura is running or not
- Show dura snapshots in IDE, and allow user to see the differences between them
- Have option to automatically watch directories when you open a workspace
- Auto download dura binary if not found (maybe)

## Requirements

Dura is needed for this extension to work properly. You can download it from the official [GitHub Repository](https://tkellogg/dura)

## Extension Settings

This extension contributes the following settings:

- `dura-vscode.startPrompt`: Choose whether or not to show the "dura is not running" prompt on startup. Possible values: prompt: autoStart
- `dura-vscode.checkWorkspaces`: Whether or not to show the prompt to watch directories

## Known Issues

## Release Notes

### [0.0.1]

- Initial release
