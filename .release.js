#!/usr/bin/env osascript -l JavaScript
app = Application.currentApplication();
app.includeStandardAdditions = true;

// remove variables flagged as 'no export'
const noExport = JSON.parse(app.doShellScript('plutil -extract variablesdontexport json -o - info.plist'));
function replacePlistKey (key, newValue){
	app.doShellScript('plutil -replace ' + key + ' -string "' + newValue + '" info.plist');
}
let i = 0;
noExport.forEach(eVar =>{
	replacePlistKey ("variables." + eVar, "");
	i++;
});
console.log("Removed " + i + " variables flagged as 'no export'.");

//zip
app.doShellScript();
