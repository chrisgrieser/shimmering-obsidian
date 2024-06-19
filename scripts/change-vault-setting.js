#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	// biome-ignore lint/nursery/useTopLevelRegex: <explanation>
	const vaultPath = argv[0].replace(/\/Users\/[^/]*/, "~")
	app.doShellScript(`plutil -replace "vault_path" -string "${vaultPath}" prefs.plist`)
	Application("com.runningwithcrayons.Alfred").reloadWorkflow($.getenv("alfred_workflow_uid"))
	return
}
