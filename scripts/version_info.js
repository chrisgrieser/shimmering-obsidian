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
function log(str) {
	output += str + "\n";
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const vaultConfig = `${vaultPath}/${configFolder}`;

	// input parameters
	const appSupportPath = app.pathTo("home folder") + "/Library/Application Support/obsidian/";
	let obsiVer;
	try {
		obsiVer = app
			.doShellScript(`cd '${appSupportPath}'; ls *.asar | grep -Eo '(\\d|\\.)*'`)
			.slice(0, -1)
			.replaceAll("\n", ";"); // multiple .asars for alpha testers
	} catch {
		obsiVer = ".asar file missing";
	}
	const macVer = app.doShellScript("sw_vers -productVersion");
	const dotObsidian = fileExists(`${vaultConfig}/`) ? "exists" : "does NOT exist";

	const advancedUriJSON = `${vaultConfig}/plugins/obsidian-advanced-uri/manifest.json`;
	const advancedUriVer = fileExists(advancedUriJSON)
		? JSON.parse(readFile(advancedUriJSON)).version
		: "Advanced URI plugin not installed.";
	const advancedUriVerOnline = onlineJSON(
		"https://github.com/Vinzent03/obsidian-advanced-uri/releases/latest/download/manifest.json",
	).version;

	const metadataExJSON = `${vaultConfig}/plugins/metadata-extractor/manifest.json`;
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

	const workspaceData15 = fileExists(`${vaultConfig}/workspace`);
	const workspaceData16 = fileExists(`${vaultConfig}/workspace.json`);

	let numberOfJSONS;
	try {
		numberOfJSONS = parseInt(app.doShellScript(
			`ls '${vaultConfig}/plugins/metadata-extractor/' | grep ".json" | grep -v "manifest" | grep -v "^data" | wc -l | tr -d " "`,
		))
	} catch (_error) {
		numberOfJSONS = -1;
	}
	const metadataJSON = `${vaultConfig}/plugins/metadata-extractor/metadata.json`;
	const metadataStrLen = fileExists(metadataJSON) ? readFile(metadataJSON).length : "no metadata.json";
	const metadataExtConfigPath = `${vaultConfig}/plugins/metadata-extractor/data.json`;
	const metadataExtConfig = fileExists(metadataExtConfigPath) ? readFile(`${vaultConfig}/plugins/metadata-extractor/data.json`) : "No Config Found."

	//──────────────────────────────────────────────────────────────────────────────

	log("");
	log("-------------------------------");
	log("INTERNAL WORKFLOW CONFIGURATION");
	log("Vault Path: " + vaultPath);
	log("config folder: " + dotObsidian);
	log(`Metadata JSONs: ${numberOfJSONS}/4`);
	if (numberOfJSONS < 4) log("Not all metadata found. Please run `osetup` and retry.");
	log("metadata.json String Length: " + metadataStrLen);
	log("-------------------------------");
	log("METADATA EXTRACTOR CONFIG");
	log(metadataExtConfig)
	log("-------------------------------");
	log("WORKSPACE DATA");
	if (workspaceData15) log("'workspace' exists");
	if (workspaceData16) log("'workspace.json' exists");
	if (!(workspaceData15 || workspaceData16)) log("none exists");
	log("-------------------------------");
	log("SYSTEM");
	log("macOS: " + macVer);
	log("Alfred: " + $.getenv("alfred_version"));
	log("-------------------------------");
	log("INSTALLED VERSION");
	log("Obsidian: " + obsiVer);
	log("This Workflow: " + $.getenv("alfred_workflow_version"));
	log("Advanced URI Plugin: " + advancedUriVer);
	log("Metadata Extractor: " + metadataExVer);
	log("-------------------------------");
	log("LATEST VERSION");
	log(`Obsidian: ${obsiVerOnline} (Insider: ${obsiVerBetaOnline})`);
	log("This Workflow: " + workflowVerOnline);
	log("Advanced URI Plugin: " + advancedUriVerOnline);
	log("Metadata Extractor: " + metadataExVerOnline);
	log("-------------------------------");

	return output;
}
