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

	function writeToFile(text, file, overwriteExistingContent) {
		try {
			const openedFile = app.openForAccess(Path(file.toString()), { writePermission: true });
			if (overwriteExistingContent) app.setEof(openedFile, { to: 0 });
			app.write(text, { to: openedFile, startingAt: app.getEof(openedFile) });
			app.closeAccess(openedFile);
			return true;
		}
		catch (error) {
			try { app.closeAccess(file) }
			catch (error_) {console.log(`Couldn't close file: ${error_}`) }
			return false;
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

	if (scratchpadHasHeading) {
		const scratchpadLines = readFile(scratchpadAbsPath).split("\n");
		const scratchpadLinesTemp = scratchpadLines
			.map (line => line = line.replace(/^#+ /gm, ""));
		const headingLineNo = scratchpadLinesTemp.indexOf(heading);
		if (headingLineNo > -1) {
			scratchpadLines.splice(headingLineNo + 1, 0, toAppend);
			writeToFile(scratchpadLines.join("\n"), scratchpadAbsPath, true);
		} else {
			console.log ("Heading not found in file. Appending to the file instead. ");
			writeToFile(toAppend, scratchpadAbsPath, false);
		}
	}
	else writeToFile(toAppend, scratchpadAbsPath, false);

	// return for opening function
	return scratchpadRelPath;
}


