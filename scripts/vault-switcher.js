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

/** @param {string} str */
function camelCaseMatch(str) {
	const subwords = str.replace(/[-_./]/g, " ");
	const fullword = str.replace(/[-_./]/g, "");
	const camelCaseSeparated = str.replace(/([A-Z])/g, " $1");
	return [subwords, camelCaseSeparated, fullword, str].join(" ") + " ";
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const currentVault = $.getenv("vault_path");
	// biome-ignore lint/nursery/useTopLevelRegex: not necessary
	const vaultNameEnc = encodeURIComponent(currentVault.replace(/.*\//, ""));

	// get vault paths
	const vaultListJson =
		app.pathTo("home folder") + "/Library/Application Support/obsidian/obsidian.json";
	const vaultList = JSON.parse(readFile(vaultListJson)).vaults;
	const vaultPaths = [];
	for (const hash in vaultList) vaultPaths.push(vaultList[hash].path);

	/** @type {AlfredItem[]} */
	const vaults = vaultPaths.map((vaultPath) => {
		// biome-ignore lint/nursery/useTopLevelRegex: not necessary
		const vaultName = vaultPath.replace(/.*\//, "");
		const vaultURI = "obsidian://open?vault=" + encodeURIComponent(vaultName);

		// visual: icons & shorter path
		let currentIcon = "";
		if (currentVault === vaultPath) currentIcon = "✅ ";
		if (vaultName.toLowerCase().includes("development")) currentIcon += "⚙️ ";
		if (vaultName === "Obsidian Sandbox") currentIcon += "🏖 ";
		// biome-ignore lint/nursery/useTopLevelRegex: not necessary
		const shortPath = vaultPath.replace(/\/Users\/[^/]*/, "~").slice(0, -(vaultName.length + 1));

		return {
			title: currentIcon + vaultName,
			subtitle: shortPath,
			arg: vaultURI,
			match: camelCaseMatch(vaultName),
			mods: {
				alt: { arg: vaultPath },
				ctrl: { arg: vaultPath },
				shift: { arg: vaultPath },
			},
			uid: vaultURI,
		};
	});

	vaults.push({
		title: "Vault Menu",
		subtitle: "Create or delete vaults",
		arg: `obsidian://advanced-uri?vault=${vaultNameEnc}&commandid=app%253Aopen-vault`,
		icon: { path: "icons/settings.png" },
		mods: {
			alt: { valid: false, subtitle: "⛔️" },
			ctrl: { valid: false, subtitle: "⛔️" },
			shift: { valid: false, subtitle: "⛔️" },
		},
		// no UID, so it's always at the bottom
	});

	return JSON.stringify({ items: vaults });
}
