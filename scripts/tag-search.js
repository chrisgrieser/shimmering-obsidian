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

const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

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
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

	const tagsJSON = `${vaultPath}/${configFolder}/plugins/metadata-extractor/tags.json`;
	const mergeNestedTags = $.getenv("merge_nested_tags") === "1";

	if (!fileExists(tagsJSON)) {
		const errorItem = {
			title: "🚫 No vault metadata found.",
			subtitle: 'Please setup the "Metadata Extractor" as described in the README.',
			valid: false,
		};
		return JSON.stringify({ items: [errorItem] });
	}

	let tagsArray = JSON.parse(readFile(tagsJSON)).map((/** @type {{ merged: boolean; }} */ tag) => {
		tag.merged = false;
		return tag;
	});

	//──────────────────────────────────────────────────────────────────────────────

	if (mergeNestedTags) {
		// reduce tag-key to the parent-tag
		tagsArray = tagsArray.map((/** @type {{ tag: string; }} */ tag) => {
			tag.tag = tag.tag.split("/")[0];
			return tag;
		});

		// merge tag-object based on same tag-key https://stackoverflow.com/a/33850667
		const mergedTags = [];
		tagsArray.forEach((/** @type {{ tag: string; tagCount: number; }} */ item) => {
			const existing = mergedTags.filter((j) => j.tag === item.tag);
			if (existing.length) {
				const mergeIndex = mergedTags.indexOf(existing[0]);
				mergedTags[mergeIndex].tagCount += item.tagCount;
				mergedTags[mergeIndex].merged = true;
			} else mergedTags.push(item);
		});
		tagsArray = mergedTags;
	}

	tagsArray = tagsArray.map(
		(/** @type {{ tag: string; merged: boolean; tagCount: number; }} */ tagData) => {
			const tagName = tagData.tag;
			const tagQuery =
				"obsidian://search?vault=" +
				vaultNameEnc +
				"&query=" +
				encodeURIComponent("tag:#" + tagName);

			let mergeInfo = "";
			let extraMatcher = "";
			if (tagData.merged) {
				mergeInfo = "  [merged]";
				extraMatcher += " merged parent";
			}
			if (tagName.includes("/")) extraMatcher += " nested child";

			const tagCountStr = tagData.tagCount ? `${tagData.tagCount}x` : "";

			return {
				title: "#" + tagName,
				subtitle: tagCountStr + mergeInfo,
				match: camelCaseMatch("#" + tagName) + extraMatcher,
				uid: tagName,
				mods: { cmd: { arg: tagQuery } },
				// passed to next script filter
				arg: "",
				variables: { selectedTag: tagName },
			};
		},
	);

	return JSON.stringify({
		items: tagsArray,
		cache: { seconds: 600, loosereload: true },
	});
}
