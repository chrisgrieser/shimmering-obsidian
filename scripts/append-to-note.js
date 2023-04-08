#!/usr/bin/env osascript -l JavaScript
function run(argv) {
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	function readFile(path) {
		const data = $.NSFileManager.defaultManager.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
		return ObjC.unwrap(str);
	}

	function writeToFile(text, file) {
		const str = $.NSString.alloc.initWithUTF8String(text);
		str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
	}

	const isHeading = line => /^#+ /.test(line);
	const isEmpty = line => /^\s*$/.test(line);
	const fileExists = filePath => Application("Finder").exists(Path(filePath));

	function ensureEmptyLineAt(fileLines, lineNo) {
		if (lineNo >= fileLines.length || !isEmpty(fileLines[lineNo])) {
			fileLines.splice(lineNo, 0, "");
		}
	}

	function getVaultPath() {
		const theApp = Application.currentApplication();
		theApp.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		return ObjC.unwrap(vault);
	}

	//───────────────────────────────────────────────────────────────────────────
	// PREPARE AND READ FILE
	let heading = "";
	let relativePath = $.getenv("relative_path");
	const prefix = $.getenv("prefix");

	const noteHasHeading = /#[^ ][^/]*$/.test(relativePath);
	if (noteHasHeading) {
		const tempArr = relativePath.split("#");
		heading = tempArr.pop();
		relativePath = tempArr.join("");
	}

	let absolutePath = getVaultPath() + "/" + relativePath;
	if (absolutePath.slice(-3) !== ".md") absolutePath += ".md";
	if (!fileExists(absolutePath)) return "invalid"; // trigger error notification in Alfred

	const noteContent = readFile(absolutePath);
	const toAppend = prefix + argv.join("");

	//───────────────────────────────────────────────────────────────────────────
	// APPEND TO FILE

	if (!noteHasHeading) {
		writeToFile(noteContent + "\n" + toAppend, absolutePath);
		return relativePath; // return for opening function
	}

	// determine heading location to append to
	const lines = noteContent.split("\n");
	const headingLineNo = lines
		.map(line => {
			const lineIsHeading = line.match(/^#+ /);
			if (lineIsHeading) return line.replace(/^#+ /gm, "");
			return ""; // ensures that a line with the same content as a heading isn't detected
		})
		.indexOf(heading);

	if (headingLineNo === -1) {
		console.warn("Heading not found. Appending to the bottom of the note instead.");
		writeToFile(noteContent + "\n" + toAppend, absolutePath);
		return relativePath; // return for opening function
	}

	// Appending
	let lastNonEmptyLineNo = -1;
	for (let i = headingLineNo + 1; i < lines.length; i++) {
		const line = lines[i];
		if (isHeading(line)) break;
		else if (!isEmpty(line)) lastNonEmptyLineNo = i;
	}
	if (lastNonEmptyLineNo > 0) {
		lines.splice(lastNonEmptyLineNo + 1, 0, toAppend);
	} else {
		ensureEmptyLineAt(lines, headingLineNo + 1);
		lines.splice(headingLineNo + 2, 0, toAppend);
		ensureEmptyLineAt(lines, headingLineNo + 3);
	}
	writeToFile(lines.join("\n") + "\n", absolutePath);

	return relativePath; // return for opening function
}
