// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fers4t" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// run on save

	const deleteSpaces = vscode.workspace.onDidSaveTextDocument(document => {  
		let code = document.getText();
		// find classes in code
		var pattern = /class="([^"]+)"/g;
		const matches = code?.match(pattern);

		if(!matches){
			var pattern = /className="([^"]+)"/g;
			const matches = code?.match(pattern);

			if(matches) {
				matches.forEach(match => {
					let className = match.replace(/\s+/g, ' ').replace('" ', '"').replace("' ", "'").trim();
					code = code?.replace(match, className);
				}
				);
				const workspaceEdit  = new vscode.WorkspaceEdit();
				if(code) {
					workspaceEdit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), code);
					vscode.workspace.applyEdit(workspaceEdit);
				}	
			}
		} else {
			matches.forEach(match => {
				let className = match.replace(/\s+/g, ' ').trim();
				code = code?.replace(match, className);
			}
			);
			const workspaceEdit  = new vscode.WorkspaceEdit();
			if( code) {
				workspaceEdit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), code);
				vscode.workspace.applyEdit(workspaceEdit);
			}
		}
	}, null, context.subscriptions);

	context.subscriptions.push(deleteSpaces);	
}

// this method is called when your extension is deactivated
export function deactivate() {}
