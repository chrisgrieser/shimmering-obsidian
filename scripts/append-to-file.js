#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

//──────────────────────────────────────────────────────────────────────────────

/**
 * @param {string} text
 * @param {string} absPath
 */
function appendToFile(text, absPath) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	text = text.replaceAll("'", "`"); // ' in text string breaks echo writing method
	app.doShellScript(`echo '${text}' >> '${absPath}'`); // use single quotes to prevent running of input such as "$(rm -rf /)"
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const vaultPath = $.getenv("vault_path");

	const content = $.getenv("prefix") + argv[0];
	const absolutePath = vaultPath + "/" + $.getenv("relative_path");
	appendToFile(content, absolutePath);
}
