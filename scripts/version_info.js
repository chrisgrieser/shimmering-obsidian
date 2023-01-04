#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
function readFile(path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}
const onlineJSON = url => JSON.parse(app.doShellScript("curl -sL '" + url + "'"));
const fileExists = filePath => Application("Finder").exists(Path(filePath));

//---------------------------------------------------------------------------

// input parameters
const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const vaultNameEnc = $.getenv("vault_name_ENC");
let output = "";

// either logs to console or returns for clipboard
function log(str) {
	output += str + "\n";
}

const appTempPath = app.pathTo("home folder") + "/Library/Application Support/obsidian/";
let obsiVer;
try {
	obsiVer = app
		.doShellScript("cd '" + appTempPath + "'; ls *.asar | grep -Eo '(\\d|\\.)*'")
		.slice(0, -1)
		.replaceAll("\n", ";"); // multiple .asars for alpha testers
} catch {
	obsiVer = ".asar file missing";
}
const macVer = app.doShellScript("sw_vers -productVersion");

const dotObsidian = fileExists(vaultPath + "/.obsidian/") ? "exists" : "does NOT exist";

const advancedUriJSON = vaultPath + "/.obsidian/plugins/obsidian-advanced-uri/manifest.json";
const advancedUriVer = fileExists(advancedUriJSON)
	? JSON.parse(readFile(advancedUriJSON)).version
	: "Advanced URI plugin not installed.";
const advancedUriVerOnline = onlineJSON(
	"https://github.com/Vinzent03/obsidian-advanced-uri/releases/latest/download/manifest.json",
).version;

const metadataExJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/manifest.json";
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

const workflowVerOnline = onlineJSON("https://api.github.com/repos/chrisgrieser/shimmering-obsidian/tags")[0].name;

const workspaceData15 = fileExists(vaultPath + "/.obsidian/workspace");
const workspaceData16 = fileExists(vaultPath + "/.obsidian/workspace.json");

const numberOfJSONS = app.doShellScript(
	"ls '" +
		vaultPath +
		'/.obsidian/plugins/metadata-extractor/\' | grep ".json" | grep -v "manifest" | grep -v "^data" | wc -l | tr -d " "',
);
const metadataJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/metadata.json";
const metadataStrLen = fileExists(metadataJSON) ? readFile(metadataJSON).length : "no metadata.json";

log("-------------------------------");
log(".obsidian: " + dotObsidian);
log("Metadata JSONs: " + numberOfJSONS + "/4");
if (numberOfJSONS < 4) log("Not all metadata not found. Please run `osetup` and retry.");
log("Metadata String Length: " + metadataStrLen);
log("-------------------------------");
log("WORKSPACE DATA");
if (workspaceData15) log("'workspace' exists");
if (workspaceData16) log("'workspace.json' exists");
if (!workspaceData15 && !workspaceData16) log("none exists");
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
log("INTERNAL WORKFLOW CONFIGURATION");
log("Vault Path: " + vaultPath);
log("Vault Name (encoded): " + vaultNameEnc);
log("-------------------------------");

// remove config
Application("com.runningwithcrayons.Alfred").removeConfiguration("ObRunning", { inWorkflow: $.getenv("alfred_workflow_bundleid") });

output; // JXA direct return
