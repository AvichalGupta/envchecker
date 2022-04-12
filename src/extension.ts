import * as vscode from 'vscode';
const acceptableCharachters: { [key: string]: string; } = {_:'_',a:'a',b:'b',c:'c',d:'d',e:'e',f:'f',g:'g',h:'h',i:'i',j:'j',k:'k',l:'l',m:'m',n:'n',o:'o',p:'p',q:'q',r:'r',s:'s',t:'t',u:'u',v:'v',w:'w',x:'x',y:'y',z:'z'};

function checkForAcceptableCharachters (str: string) {
	console.log(str);
	let char = str[str.length-1];
	console.log(char);
	if(acceptableCharachters[char.toLowerCase()]) {
		return str.slice(1);
	}
	return str.slice(1,str.length-1);
}

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('envchecker.helloWorld', async() => {
		if(vscode.workspace.workspaceFolders) {
			let doc = await vscode.workspace.openTextDocument(vscode.workspace.workspaceFolders[0].uri.path + "/.env");
			let envData,envFileKey,envFileKeysArr=new Set();
			for (let i=0;i<doc.lineCount;i++) {
				envData = doc.lineAt(i).text;
				envFileKey = envData.toString().split("=")[0];
				envFileKeysArr.add(envFileKey);
			}
			if(vscode.window.activeTextEditor) {
				let currentDoc = await vscode.workspace.openTextDocument(vscode.window.activeTextEditor.document.fileName);
				let envKeyInActiveFile: string;
				let currentLine,splitLineData;
				console.log(currentDoc.getText().split('process.env'));
				for(let i=0;i<currentDoc.lineCount;i++) {
					currentLine = currentDoc.lineAt(i).text;
					if(currentLine.includes('process.env')) {
						splitLineData = currentLine.toString().split('process.env');
						for(let j=0;j<splitLineData.length;j++) {
							if(splitLineData[j].includes('.')) { 
								envKeyInActiveFile = checkForAcceptableCharachters(splitLineData[j]);
								if(!envFileKeysArr.has(envKeyInActiveFile)) {
									vscode.window.showErrorMessage(`Key ${envKeyInActiveFile} is not present in .env file`);
								}
							}
						}
					}
				}
			}
		}
	});
	context.subscriptions.push(disposable);
}
export function deactivate() {}

