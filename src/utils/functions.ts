import { nextTick } from 'process'
import * as vscode from 'vscode'

export function sortClasses() {
  const window = vscode?.window
  const editor = window?.activeTextEditor
  const document = editor?.document

  // get settings
  const settings = vscode.workspace.getConfiguration('classprettier')
  const sortingEnabled = settings.sortingEnabled
  const sortBy = settings.sortBy

  if (!document) {
    return
  }

  // get document
  let code = document.getText()
  // find classes in code
  var pattern = /className=(?:"|')([^"]+)(?:"|')/g
  const matches = code?.match(pattern)
  const workspaceEdit = new vscode.WorkspaceEdit()
  if (!matches) {
    var pattern = /className=(?:"|')([^"]+)(?:"|')/g
    const matches = code?.match(pattern)

    if (matches) {
      // is "className"
      matches.forEach((match) => {
        console.log({ match })
        let className = match
          .replace(/\s+/g, ' ')
          .replace('" ', '"')
          .replace(' "', '"')
          .replace("' ", "'")
          .replace(" '", "'")
          .trim()

        // sort classnames
        if (sortingEnabled) {
          // get classnames from string
          let delimiter = className.charAt(10)
          let classNames = className.substring(
            className.indexOf(delimiter) + 1,
            className.lastIndexOf(delimiter),
          )
          let classNamesArray = classNames.split(' ')
          if (sortBy === 'ASC') {
            classNamesArray.sort()
          } else {
            classNamesArray.sort().reverse()
          }
          classNames = classNamesArray.join(' ')
          classNames = 'className=' + delimiter + classNames + delimiter
          code = code?.replace(match, classNames)
        }
      })
      const workspaceEdit = new vscode.WorkspaceEdit()
      if (code) {
        workspaceEdit.replace(
          document.uri,
          new vscode.Range(0, 0, document.lineCount, 0),
          code,
        )
        vscode.workspace.applyEdit(workspaceEdit)
      }
    }
  } else {
    // is "class"
    matches.forEach((match) => {
      let className = match.replace(/\s+/g, ' ').trim()
      code = code?.replace(match, className)

      // sort classnames
      if (sortingEnabled) {
        // get classnames from string
        let delimiter = className.charAt(10)
        let classNames = className.substring(
          className.indexOf(delimiter) + 1,
          className.lastIndexOf(delimiter),
        )
        let classNamesArray = classNames.split(' ')
        if (sortBy === 'ASC') {
          classNamesArray.sort()
        } else {
          classNamesArray.sort().reverse()
        }
        classNames = classNamesArray.join(' ')
        classNames = 'className=' + delimiter + classNames + delimiter
        code = code?.replace(match, classNames)
      }
    })

    if (code) {
      workspaceEdit.replace(
        document.uri,
        new vscode.Range(0, 0, document.lineCount, 0),
        code,
      )
    }
  }
  vscode.workspace.applyEdit(workspaceEdit)
}

export function deleteEmptyClasses() {
  const window = vscode?.window
  const editor = window?.activeTextEditor
  const document = editor?.document
  const settings = vscode.workspace.getConfiguration('classprettier')
  const deleteEmptyClasses = settings.deleteEmptyClasses

  if (!deleteEmptyClasses) {
    return
  }
  if (!document) {
    return
  }
  // get document
  let code = document.getText()

  // find classes in code
  var classNamePattern = /className=(?:"|')(?:"|')/g
  var classPattern = /class=(?:"|')(?:"|')/g

  const classNameMatches = code?.match(classNamePattern)
  const classMatches = code?.match(classPattern)
  const workspaceEdit = new vscode.WorkspaceEdit()
  if (classNameMatches) {
    // is "className"
    classNameMatches.forEach((match) => {
      code = code?.replace(match, '')
    })

    if (code) {
      workspaceEdit.replace(
        document.uri,
        new vscode.Range(0, 0, document.lineCount, 0),
        code,
      )
    }
  } else if (classMatches) {
    // is 'class'
    classMatches.forEach((match) => {
      code = code?.replace(match, '')
    })

    if (code) {
      workspaceEdit.replace(
        document.uri,
        new vscode.Range(0, 0, document.lineCount, 0),
        code,
      )
    }
  }
  return vscode.workspace.applyEdit(workspaceEdit)
}

// type is array of functions
export function runFunctionsInOrder(functions: (() => void)[]) {
  return functions.forEach((functionToRun) => {
    functionToRun()
  })
}
