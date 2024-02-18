#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} path */
function readFile(path) {
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const workspaceJSON = JSON.parse(readFile(`${vaultPath}/${configFolder}/workspaces.json`));
	const currentWorkspace = workspaceJSON.active;

	// GUARD 
	if (!currentWorkspace) {
		return JSON.stringify({
			items: [{
				title: "No Active Workspace found.",
				subtitle: "Workspaces Core Plugin potentially not enabled.",
			}],
		});
	}

	/** @type {AlfredItem[]} */
	const workspaces = Object.keys(workspaceJSON.workspaces).map((workspace) => {
		let iconpath = "icons/workspace.png";
		if (workspace.toLowerCase().includes("longform")) iconpath = "icons/writing.png";

		return {
			title: `Load "${workspace}"`,
			match: workspace.replaceAll("-", " ") + " " + workspace,
			arg: workspace,
			uid: workspace,
			icon: { path: iconpath },
		};
	});

	// Save Current Workspace
	workspaces.push({
		title: `Save "${currentWorkspace}"`,
		arg: "_save-workspace",
		icon: { path: "icons/save-workspace.png" },
		uid: "save-workspace",
	});

	// Manage Workspaces
	workspaces.push({
		title: "Manage Workspaces",
		arg: "_manage-workspace",
		icon: { path: "icons/settings.png" },
		// no UID to ensure it is on bottom
	});

	return JSON.stringify({ items: workspaces });
}
