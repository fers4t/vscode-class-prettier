"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortClasses = void 0;
const vscode = require("vscode");
function sortClasses({ document }) {
    // get settings
    const settings = vscode.workspace.getConfiguration('classprettier');
    const sortingEnabled = settings.sortingEnabled;
    const sortBy = settings.sortBy;
    const deleteEmptyClasses = settings.deleteEmptyClasses;
    // get document
    let code = document.getText();
    // find classes in code
    var pattern = /className=(?:"|')([^"]+)(?:"|')/g;
    const matches = code?.match(pattern);
    if (!matches) {
        var pattern = /className=(?:"|')([^"]+)(?:"|')/g;
        const matches = code?.match(pattern);
        if (matches) {
            // is "className"
            matches.forEach(match => {
                let className = match.replace(/\s+/g, ' ').replace('" ', '"').replace(' "', '"').replace("' ", "'").replace(" '", "'").trim();
                // sort classnames
                if (sortingEnabled) {
                    // get classnames from string
                    let delimiter = className.charAt(10);
                    console.log({ delimiter });
                    let classNames = className.substring(className.indexOf(delimiter) + 1, className.lastIndexOf(delimiter));
                    let classNamesArray = classNames.split(' ');
                    if (sortBy === "ASC") {
                        classNamesArray.sort();
                    }
                    else {
                        classNamesArray.sort().reverse();
                    }
                    classNames = classNamesArray.join(' ');
                    classNames = 'className=' + delimiter + classNames + delimiter;
                    code = code?.replace(match, classNames);
                }
            });
            const workspaceEdit = new vscode.WorkspaceEdit();
            if (code) {
                workspaceEdit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), code);
                vscode.workspace.applyEdit(workspaceEdit);
            }
        }
    }
    else {
        // is "class"
        matches.forEach(match => {
            let className = match.replace(/\s+/g, ' ').trim();
            code = code?.replace(match, className);
            // sort classnames
            if (sortingEnabled) {
                // get classnames from string
                let delimiter = className.charAt(10);
                let classNames = className.substring(className.indexOf(delimiter) + 1, className.lastIndexOf(delimiter));
                let classNamesArray = classNames.split(' ');
                if (sortBy === "ASC") {
                    classNamesArray.sort();
                }
                else {
                    classNamesArray.sort().reverse();
                }
                classNames = classNamesArray.join(' ');
                classNames = 'className=' + delimiter + classNames + delimiter;
                code = code?.replace(match, classNames);
            }
        });
        const workspaceEdit = new vscode.WorkspaceEdit();
        if (code) {
            workspaceEdit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), code);
            vscode.workspace.applyEdit(workspaceEdit);
        }
    }
}
exports.sortClasses = sortClasses;
//# sourceMappingURL=functions.js.map