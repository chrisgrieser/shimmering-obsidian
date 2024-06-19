#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const vaultPath = argv[0]
	app.doShellScript(`plutil -replace "vault_path" -string "${vaultPath}" prefs.plist`);

	// make Alfred pick up the preference change & empty the cache for o-search
	Application("com.runningwithcrayons.Alfred").reloadWorkflow($.getenv("alfred_workflow_uid"));

	return;
}
