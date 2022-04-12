import * as vscode from 'vscode';
import * as moment from 'moment';
const acceptableCharachters: { [key: string]: string; } = {_:'_',$:'$',a:'a',b:'b',c:'c',d:'d',e:'e',f:'f',g:'g',h:'h',i:'i',j:'j',k:'k',l:'l',m:'m',n:'n',o:'o',p:'p',q:'q',r:'r',s:'s',t:'t',u:'u',v:'v',w:'w',x:'x',y:'y',z:'z'};

// ',',')',';',' ','[',']','=','+','-','*','/','^','%'
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('envchecker.checkFile', async() => {
		const startTime = moment.now();
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
				let envKeyIndexInActiveFile = 0;
				let currentDocText = currentDoc.getText();
				let occurenceIndex;
				let occurenceIndices: number[] = [];
				let startIndex = 0;
				let searchText = 'process.env';
				while((occurenceIndex = currentDocText.indexOf('process.env',startIndex))>-1) {
					envKeyIndexInActiveFile = occurenceIndex+searchText.length+1;
					occurenceIndices.push(envKeyIndexInActiveFile);
					startIndex = occurenceIndex+searchText.length;
					console.log(currentDocText[envKeyIndexInActiveFile]);
				}
				// console.log('occurenceIndices',occurenceIndices);
				let i = occurenceIndices[0];
				let envKeyInActiveFile = '';
				let m=0;
				let excludedKeysInActiveFile = new Set<string>();
				while(i<currentDocText.length) {
					if(acceptableCharachters[currentDocText[i].toLowerCase()]){
						envKeyInActiveFile+=currentDocText[i];
						i++;
					} else {
						if(!envFileKeysArr.has(envKeyInActiveFile)){
							excludedKeysInActiveFile.add(envKeyInActiveFile);
						}
						envKeyInActiveFile='';
						m+=1;
						i=occurenceIndices[m];
					}
				}
				// console.log('excludedKeysInActiveFile: ',excludedKeysInActiveFile);
				let finalExcludedKeysObj = '';
				if(excludedKeysInActiveFile.size) {
					for(let i=0;i<excludedKeysInActiveFile.size;i+=1) {
						finalExcludedKeysObj+=`${[...excludedKeysInActiveFile][i]}, \n`;
					}
					vscode.window.showErrorMessage(`The following keys are not present in your .env file: \n${finalExcludedKeysObj}`);
				}
			} else {
				vscode.window.showErrorMessage('Please open any file to use ENVChecker.');
			}
		} else {
			vscode.window.showErrorMessage('Please open any folder to use ENVChecker.');
		}
		const stopTime = moment.now();
		console.log('execution time: ', (stopTime-startTime)/1000, 'seconds');
	});
	context.subscriptions.push(disposable);
}
export function deactivate() {}

