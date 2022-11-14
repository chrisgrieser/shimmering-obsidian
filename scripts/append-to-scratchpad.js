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

	function writeToFile(text, file) {
		const str = $.NSString.alloc.initWithUTF8String(text);
		str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
	}

	const isHeading = line => /^#+ /.test(line);
	const isEmpty = line => /^\s*$/.test(line);
	const fileExists = (filePath) => Application("Finder").exists(Path(filePath));

	function ensureEmptyLineAt(lines, lineNo) {
		if (lineNo >= lines.length || !isEmpty(lines[lineNo])) lines.splice(lineNo, 0, "");
	}

	//───────────────────────────────────────────────────────────────────────────
	// PREPARE AND READ FILE
	let heading = "";
	let scratchpadRelPath = $.getenv("scratchpad_note_path");
	const prefix = $.getenv("scratchpad_append_prefix");

	const scratchpadPathHasHeading = /#[^ ][^/]*$/.test(scratchpadRelPath);
	if (scratchpadPathHasHeading) {
		const tempArr = scratchpadRelPath.split("#");
		heading = tempArr.pop();
		scratchpadRelPath = tempArr.join("");
	}

	let scratchpadAbsPath = $.getenv("vault_path")
		.replace(/^~/, app.pathTo("home folder"))
		+ "/" + scratchpadRelPath;
	if (scratchpadAbsPath.slice(-3) !== ".md") scratchpadAbsPath += ".md";
	if (!fileExists(scratchpadAbsPath)) {
		console.error("Scratchpad path invalid. Appending cancelled.");
		return;
	}

	const scratchpadContent = readFile(scratchpadAbsPath);
	const toAppend = prefix + argv.join("");

	//───────────────────────────────────────────────────────────────────────────
	// APPEND TO FILE

	if (!scratchpadPathHasHeading) {
		writeToFile(scratchpadContent + "\n" + toAppend, scratchpadAbsPath);
		return scratchpadRelPath; // return for opening function
	}

	// determine heading location to append to
	const scratchpadLines = scratchpadContent.split("\n");
	const headingLineNo = scratchpadLines
		.map(line => {
			const lineIsHeading = line.match(/^#+ /);
			if (lineIsHeading) return line.replace(/^#+ /gm, "");
			return ""; // ensures that a line with the same content as a heading isn't detected
		})
		.indexOf(heading);

	if (headingLineNo === -1) {
		console.warn("Heading not found. Appending to the bottom of the file instead.");
		writeToFile(scratchpadContent + "\n" + toAppend, scratchpadAbsPath);
		return scratchpadRelPath; // return for opening function
	}

	// Appending
	let lastNonEmptyLineNo = -1;
	for (let i = headingLineNo + 1; i < scratchpadLines.length; i++) {
		const line = scratchpadLines[i];
		if (isHeading(line)) break;
		else if (!isEmpty(line)) lastNonEmptyLineNo = i;
	}
	if (lastNonEmptyLineNo > 0) {
		scratchpadLines.splice(lastNonEmptyLineNo + 1, 0, toAppend);
	} else {
		ensureEmptyLineAt(scratchpadLines, headingLineNo + 1);
		scratchpadLines.splice(headingLineNo + 2, 0, toAppend);
		ensureEmptyLineAt(scratchpadLines, headingLineNo + 3);
	}
	writeToFile(scratchpadLines.join("\n") + "\n", scratchpadAbsPath);

	return scratchpadRelPath; // return for opening function
}
