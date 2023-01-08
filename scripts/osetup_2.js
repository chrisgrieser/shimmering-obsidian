#!/usr/bin/env osascript -l JavaScript

function run(argv) {
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

	function writeData(key, newValue) {
		const dataPath = `./${key}`; // save in workflow folder, so paths are synced
		const str = $.NSString.alloc.initWithUTF8String(newValue);
		str.writeToFileAtomicallyEncodingError(dataPath, true, $.NSUTF8StringEncoding, null);
	}

	function writeToFile(file, text) {
		const str = $.NSString.alloc.initWithUTF8String(text);
		str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
	}

	//───────────────────────────────────────────────────────────────────────────

	const vaultPath = argv.join("");
	writeData("vaultPath", vaultPath.replace(/\/Users\/.*?\//i, "~/"));

	// error message if a plugin is not installed in that vault
	let errorMsg = "";
	const activatedPlugins = JSON.parse(readFile(vaultPath + "/.obsidian/community-plugins.json"));
	if (!activatedPlugins.includes("metadata-extractor"))
		errorMsg += "Metadata Extractor is not installed or not enabled in the selected vault. \n";
	if (!activatedPlugins.includes("obsidian-advanced-uri"))
		errorMsg += "Advanced URI Plugin is not installed or not enabled in the selected vault. \n";

	if (errorMsg) {
		errorMsg = `Error:
${errorMsg}
Please install & enable the plugin and re-run "osetup"`;
		return errorMsg;
	}
	//───────────────────────────────────────────────────────────────────────────

	// configure metadata extractor
	// INFO due to the setting "writeFilesOnLaunch", don't need to dump the metadata
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
