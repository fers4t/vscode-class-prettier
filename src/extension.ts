// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import {
  deleteEmptyClasses,
  runFunctionsInOrder,
  cleanAndSortClasses,
} from './utils/functions'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const sortClassesCommand = vscode.commands.registerCommand(
    'classprettier.sortClasses',
    () => cleanAndSortClasses(),
  )

  const deleteEmptyClassesCommand = vscode.commands.registerCommand(
    'classprettier.deleteEmptyClasses',
    () => deleteEmptyClasses(),
  )

  context.subscriptions.push(sortClassesCommand)
  context.subscriptions.push(deleteEmptyClassesCommand)
  context.subscriptions.push(runOnSave)
}

// this method is called when your extension is deactivated
export function deactivate() {}

const runOnSave = vscode.workspace.onDidSaveTextDocument((document) => {
  // execute commands
  vscode.commands
    .executeCommand('classprettier.deleteEmptyClasses')
    .then(() => vscode.commands.executeCommand('classprettier.sortClasses'))
}, null)
