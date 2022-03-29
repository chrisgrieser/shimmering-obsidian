#!/usr/bin/env osascript -l JavaScript

function run (argv) {

	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	function readFile (path, encoding) {
		if (!encoding) encoding = $.NSUTF8StringEncoding;
		const fm = $.NSFileManager.defaultManager;
		const data = fm.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
		return ObjC.unwrap(str);
	}

	function writeToFile(text, file) {
		let str = $.NSString.alloc.initWithUTF8String(text);
		str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
	}

	function isHeading(line) {
		return /^#+ /.test(line)
	}

	function isEmpty(line) {
		return /^\s*$/.test(line)
	}

	function ensureEmptyLineAt(lines, lineNo) {
		if (lineNo >= lines.length  || !isEmpty(lines[lineNo])) {
			lines.splice(lineNo, 0, "");
		}
	}

	let heading = "";
	let scratchpadRelPath = $.getenv("scratchpad_note_path");
	const scratchpadHasHeading = /#[^ ][^/]*$/.test(scratchpadRelPath);
	if (scratchpadHasHeading) {
		const tempArr = scratchpadRelPath.split("#");
		heading = tempArr.pop();
		scratchpadRelPath = tempArr.join("");
	}

	let scratchpadAbsPath = $.getenv("vault_path")
		.replace(/^~/, app.pathTo("home folder"))
		+ "/" + scratchpadRelPath;
	if (scratchpadAbsPath.slice(-3) !== ".md") scratchpadAbsPath += ".md";

	const toAppend = $.getenv("scratchpad_append_prefix") + argv.join("");
	const scratchpadContent = readFile(scratchpadAbsPath);

	if (scratchpadHasHeading) {
		const scratchpadLines = scratchpadContent.split("\n");
		const scratchpadLinesTemp = scratchpadLines
			.map (line => line = line.replace(/^#+ /gm, ""));
		const headingLineNo = scratchpadLinesTemp.indexOf(heading);
		if (headingLineNo > -1) {
			let lastNonEmptyLineNo = -1
			for (let i = headingLineNo + 1; i < scratchpadLines.length; i++) {
				let line = scratchpadLines[i]
				if (isHeading(line)) {
					break;
				} else if (!isEmpty(line)) {
					lastNonEmptyLineNo = i;
				}
			}
			if (lastNonEmptyLineNo > 0) {
				scratchpadLines.splice(lastNonEmptyLineNo + 1, 0, toAppend);
			} else {
				ensureEmptyLineAt(scratchpadLines, headingLineNo + 1);
				scratchpadLines.splice(headingLineNo + 2, 0, toAppend);
				ensureEmptyLineAt(scratchpadLines, headingLineNo + 3);
			}
			writeToFile(scratchpadLines.join("\n"), scratchpadAbsPath, true);
		} else {
			console.log ("Heading not found in file. Appending to the file instead. ");
			writeToFile(scratchpadContent + "\n" + toAppend, scratchpadAbsPath);
		}
	}
	else writeToFile(scratchpadContent + "\n" + toAppend, scratchpadAbsPath);

	// return for opening function
	return scratchpadRelPath;
}
