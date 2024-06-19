#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

/**
 * @param {string} file
 * @param {string} text
 */
function writeToFile(file, text) {
	app.doShellScript(`mkdir -p "$(dirname "${file}")" ; touch "${file}"`);
	const str = $.NSString.alloc.initWithUTF8String(text);
	str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
}

const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");

	let errorMsg = ""; // error message if a plugin is not installed in that vault

	const pluginFolder = `${vaultPath}/${configFolder}/plugins`;
	const pluginList = readFile(`${vaultPath}/${configFolder}/community-plugins.json`);

	if (pluginList) {
		const activatedPlugins = JSON.parse(pluginList);
		if (!activatedPlugins.includes("metadata-extractor") || !fileExists(`${pluginFolder}/metadata-extractor`))
			errorMsg += "Metadata Extractor is not installed or not enabled in the selected vault. \n\n";
		if (!activatedPlugins.includes("obsidian-advanced-uri") || !fileExists(`${pluginFolder}/obsidian-advanced-uri`))
			errorMsg += "Advanced URI Plugin is not installed or not enabled in the selected vault. \n\n";
		if (errorMsg)
			errorMsg = "ERROR\n\n" + errorMsg + "Please install & enable the plugin(s) and re-run `osetup`.";
	} else {
		errorMsg +=
			'ERROR\n\nNo plugins found in the selected vault.\nPlease install & enable the "Metadata Extractor" plugin & the "Advanced URI" plugin, restart the vault, and run `osetup` again.';
	}
	if (errorMsg) return errorMsg;

	//───────────────────────────────────────────────────────────────────────────
	// CONFIGURE METADATA EXTRACTOR

	// INFO due to the setting "writeFilesOnLaunch", don't need to dump the
	// metadata since we restart Obsidian which already triggers that
	const config = {
		writingFrequency: "30", // yes, saved as string in metadata extractor settings
		writeFilesOnLaunch: true,
	};
	writeToFile(`${vaultPath}/${configFolder}/plugins/metadata-extractor/data.json`, JSON.stringify(config));

	// restart Obsidian
	app.displayNotification("", { withTitle: "⌛ Restarting Obsidian…" });

	const obsidian = Application("Obsidian");
	obsidian.includeStandardAdditions = true;
	obsidian.quit();
	while (obsidian.running()) {
		delay(0.2);
	}
	obsidian.activate();
	return
}
