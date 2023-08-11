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
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const workspaceToSpellcheck = $.getenv("workspace_to_spellcheck").split(/ ?, ?/);
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");

	const workspaceJSON = JSON.parse(readFile(`${vaultPath}/${configFolder}/workspaces.json`));
	const workspaceArray = Object.keys(workspaceJSON.workspaces);
	const currentWorkspace = workspaceJSON.active;

	const jsonArray = [];
	workspaceArray.forEach((workspaceName) => {
		// icons/emoji
		let spellcheckInfo = "";
		if (workspaceToSpellcheck.includes(workspaceName)) spellcheckInfo = " 🖍";
		let iconpath = "icons/workspace.png";
		if (workspaceName.toLowerCase().includes("writing") || workspaceName.toLowerCase().includes("longform"))
			iconpath = "icons/writing.png";

		jsonArray.push({
			title: `Load "${workspaceName}" ${spellcheckInfo}`,
			match: workspaceName.replaceAll("-", " ") + " " + workspaceName,
			arg: workspaceName,
			uid: workspaceName,
			icon: { path: iconpath },
		});
	});

	// Save Current Workspace
	jsonArray.push({
		title: `Save "${currentWorkspace}"`,
		arg: "_save-workspace",
		icon: { path: "icons/save-workspace.png" },
		uid: "save-workspace",
	});

	// Manage Workspaces (no UID to ensure it is on bottom)
	jsonArray.push({
		title: "Manage Workspaces",
		arg: "_manage-workspace",
		icon: { path: "icons/settings.png" },
	});

	return JSON.stringify({ items: jsonArray });
}
