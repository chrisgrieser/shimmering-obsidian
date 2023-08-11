#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}
const onlineJSON = (/** @type {string} */ url) => JSON.parse(app.doShellScript(`curl -sL '${url}'`));
const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

let output = "";
/** @param {string} str */
function logger(str) {
	output += str + "\n";
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");

	// input parameters
	const appTempPath = app.pathTo("home folder") + "/Library/Application Support/obsidian/";
	let obsiVer;
	try {
		obsiVer = app
			.doShellScript(`cd '${appTempPath}'; ls *.asar | grep -Eo '(\\d|\\.)*'`)
			.slice(0, -1)
			.replaceAll("\n", ";"); // multiple .asars for alpha testers
	} catch {
		obsiVer = ".asar file missing";
	}
	const macVer = app.doShellScript("sw_vers -productVersion");
	const dotObsidian = fileExists(`${vaultPath}/${configFolder}/`) ? "exists" : "does NOT exist";

	const advancedUriJSON = `${vaultPath}/${configFolder}/plugins/obsidian-advanced-uri/manifest.json`;
	const advancedUriVer = fileExists(advancedUriJSON)
		? JSON.parse(readFile(advancedUriJSON)).version
		: "Advanced URI plugin not installed.";
	const advancedUriVerOnline = onlineJSON(
		"https://github.com/Vinzent03/obsidian-advanced-uri/releases/latest/download/manifest.json",
	).version;

	const metadataExJSON = `${vaultPath}/${configFolder}/plugins/metadata-extractor/manifest.json`;
	const metadataExVer = fileExists(metadataExJSON)
		? JSON.parse(readFile(metadataExJSON)).version
		: "Metadata Extractor plugin not installed.";
	const metadataExVerOnline = onlineJSON(
		"https://github.com/kometenstaub/metadata-extractor/releases/latest/download/manifest.json",
	).version;

	const obsiOnlineInfo = onlineJSON(
		"https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/desktop-releases.json",
	);
	const obsiVerOnline = obsiOnlineInfo.latestVersion;
	const obsiVerBetaOnline = obsiOnlineInfo.beta.latestVersion;

	const workflowVerOnline = onlineJSON(
		"https://api.github.com/repos/chrisgrieser/shimmering-obsidian/tags",
	)[0].name;

	const workspaceData15 = fileExists(`${vaultPath}/${configFolder}/workspace`);
	const workspaceData16 = fileExists(`${vaultPath}/${configFolder}/workspace.json`);

	let numberOfJSONS;
	try {
		numberOfJSONS = parseInt(app.doShellScript(
			`ls '${vaultPath}/${configFolder}/plugins/metadata-extractor/' | grep ".json" | grep -v "manifest" | grep -v "^data" | wc -l | tr -d " "`,
		))
	} catch (_error) {
		numberOfJSONS = 0;
	}
	const metadataJSON = `${vaultPath}/${configFolder}/plugins/metadata-extractor/metadata.json`;
	const metadataStrLen = fileExists(metadataJSON) ? readFile(metadataJSON).length : "no metadata.json";

	//──────────────────────────────────────────────────────────────────────────────

	logger("");
	logger("-------------------------------");
	logger("INTERNAL WORKFLOW CONFIGURATION");
	logger("Vault Path: " + vaultPath);
	logger("config folder: " + dotObsidian);
	logger(`Metadata JSONs: ${numberOfJSONS}/4`);
	if (numberOfJSONS < 4) logger("Not all metadata not found. Please run `osetup` and retry.");
	logger("metadata.json String Length: " + metadataStrLen);
	logger("-------------------------------");
	logger("WORKSPACE DATA");
	if (workspaceData15) logger("'workspace' exists");
	if (workspaceData16) logger("'workspace.json' exists");
	if (!workspaceData15 && !workspaceData16) logger("none exists");
	logger("-------------------------------");
	logger("SYSTEM");
	logger("macOS: " + macVer);
	logger("Alfred: " + $.getenv("alfred_version"));
	logger("-------------------------------");
	logger("INSTALLED VERSION");
	logger("Obsidian: " + obsiVer);
	logger("This Workflow: " + $.getenv("alfred_workflow_version"));
	logger("Advanced URI Plugin: " + advancedUriVer);
	logger("Metadata Extractor: " + metadataExVer);
	logger("-------------------------------");
	logger("LATEST VERSION");
	logger(`Obsidian: ${obsiVerOnline} (Insider: ${obsiVerBetaOnline})`);
	logger("This Workflow: " + workflowVerOnline);
	logger("Advanced URI Plugin: " + advancedUriVerOnline);
	logger("Metadata Extractor: " + metadataExVerOnline);
	logger("-------------------------------");

	return output; // JXA direct return
}
