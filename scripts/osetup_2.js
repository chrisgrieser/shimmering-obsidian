#!/usr/bin/env osascript -l JavaScript

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
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

	/**
	 * @param {string} file
	 * @param {string} text
	 */
	function writeToFile(file, text) {
		app.doShellScript(`mkdir -p "$(dirname "${file}")" ; touch "${file}"`);
		const str = $.NSString.alloc.initWithUTF8String(text);
		str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
	}

	//───────────────────────────────────────────────────────────────────────────

	const vaultPath = argv.join("");
	writeToFile($.getenv("alfred_workflow_data") + "/vaultPath", vaultPath.replace(/\/Users\/.*?\//i, "~/"));

	// error message if a plugin is not installed in that vault
	let errorMsg = "";
	const pluginList = readFile(vaultPath + "/.obsidian/community-plugins.json");
	if (pluginList) {
		const activatedPlugins = JSON.parse(pluginList);
		if (!activatedPlugins.includes("metadata-extractor"))
			errorMsg += "Metadata Extractor is not installed or not enabled in the selected vault. \n\n";
		if (!activatedPlugins.includes("obsidian-advanced-uri"))
			errorMsg += "Advanced URI Plugin is not installed or not enabled in the selected vault. \n\n";
		if (errorMsg)
			errorMsg = "ERROR\n\n" + errorMsg + "Please install & enable the plugin(s) and re-run `osetup`.";
	} else {
		errorMsg +=
			"ERROR\n\nNo plugins found in the selected vault.\nPlease install & enable the Metadata Extractor plugin & the Advanced URI plugin, restart the vault, and run `osetup` again.";
	}
	if (errorMsg) return errorMsg;

	//───────────────────────────────────────────────────────────────────────────
	// CONFIGURE METADATA EXTRACTOR

	// INFO due to the setting "writeFilesOnLaunch", don't need to dump the
	// metadata since we restart Obsidian which already triggers that
	const config = `{ "writingFrequency": "30", "writeFilesOnLaunch": true }`;
	writeToFile(vaultPath + "/.obsidian/plugins/metadata-extractor/data.json", config);

	// restart Obsidian
	const vaultName = vaultPath.split("/").pop();
	app.displayNotification("⌛ Restarting Obsidian…", { withTitle: `Selected ${vaultName}` });

	const obsidian = Application("Obsidian");
	obsidian.includeStandardAdditions = true;
	obsidian.quit();
	do delay(0.2);
	while (obsidian.running());
	obsidian.activate();

	// delay showing the success notification until Obsidian is actually restarted
	delay(0.5);
	return "🥳 Workflow Setup complete";
}
