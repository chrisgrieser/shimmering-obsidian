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

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const currentVault = $.getenv("vault_path");
	const vaultListJson = app.pathTo("home folder") + "/Library/Application Support/obsidian/obsidian.json";

	// get vault paths
	const vaultList = JSON.parse(readFile(vaultListJson)).vaults;
	const vaultArray = [];
	const jsonArray = [];
	for (const hash in vaultList) vaultArray.push(vaultList[hash].path);

	//──────────────────────────────────────────────────────────────────────────────

	vaultArray.forEach((vaultPath) => {
		const vaultName = vaultPath.replace(/.*\//, "");
		const vaultURI = "obsidian://open?vault=" + encodeURIComponent(vaultName);

		// visual: icons & shorter path
		let currentIcon = "";
		if (currentVault === vaultPath) currentIcon = "✅ ";
		if (vaultName.toLowerCase().includes("development")) currentIcon += "⚙️ ";
		if (vaultName === "Obsidian Sandbox") currentIcon += "🏖 ";
		const shortPath = vaultPath.replace(/\/Users\/[^/]*/, "~").slice(0, -(vaultName.length + 1));

		jsonArray.push({
			title: currentIcon + vaultName,
			subtitle: shortPath,
			arg: vaultURI,
			mods: {
				// info message for transition period
				shift: {
					valid: false,
					subtitle: "⛔️ Vaults control is now switched via workflow configuration.",
				},
				alt: { arg: vaultPath },
				cmd: { arg: vaultPath },
				ctrl: { arg: vaultPath },
			},
		});
	});

	jsonArray.push({
		title: "Vault Menu",
		subtitle: "Create or delete vaults",
		arg: "obsidian://advanced-uri?commandid=app%253Aopen-vault",
		icon: { path: "icons/settings.png" },
		mods: {
			alt: {
				valid: false,
				subtitle: "⛔️",
			},
			cmd: {
				valid: false,
				subtitle: "⛔️",
			},
			ctrl: {
				valid: false,
				subtitle: "⛔️",
			},
		},
	});

	return JSON.stringify({ items: jsonArray });
}
