/** @param {string} url */
async function getOnlineJson (url) {
	const response = await fetch(url)
	return await response.json();
}

/** @param {string} url */
async function getOnlineRaw (url) {
	const response = await fetch(url)
	return await response.text();
}

/** INFO not the same Alfred Matcher used in the other scripts
 *	has to include "#" and "+" as well for headers
 *	"`" has to be included for inline code in headers
 * @param {string} str
 */
function alfredMatcher(str) {
	return " " + str.replace(/[-()_#+.`]/g, " ") + " " + str + " ";
}

//──────────────────────────────────────────────────────────────────────────────

// biome-ignore lint/correctness/noUnusedVariables: Alfred run
async function run() {
	const jsonArray = [];
	const officialDocsURL = "https://help.obsidian.md/";
	const officialDocsJSON = await getOnlineJson(
		"https://api.github.com/repos/obsidianmd/obsidian-docs/git/trees/master?recursive=1",
	);
	const rawGitHubURL = "https://raw.githubusercontent.com/obsidianmd/obsidian-docs/master/";
	const communityDocsURL = "https://publish.obsidian.md/hub/";
	const communityDocsJSON = await getOnlineJson(
		"https://api.github.com/repos/obsidian-community/obsidian-hub/git/trees/main?recursive=1",
	);

	// OFFICIAL DOCS
	const officialDocs = officialDocsJSON.tree.filter(
		(/** @type {{ path: string; }} */ item) =>
			item.path.slice(-3) === ".md" &&
			item.path.slice(0, 3) === "en/" &&
			item.path.slice(0, 9) !== "en/.trash",
	);

	officialDocs.forEach((/** @type {{ path: string; }} */ item) => {
		const area = item.path.split("/").slice(1, -1).join("/");
		const url = officialDocsURL + item.path.slice(3, -3).replaceAll(" ", "+");
		const title = (item.path.split("/").pop() || "error").slice(0, -3);

		jsonArray.push({
			title: title,
			match: alfredMatcher(title),
			subtitle: area,
			uid: url,
			arg: url,
		});
	});

	// HEADINGS of Official Docs
	officialDocs.forEach(async (/** @type {{ path: string; }} */ doc) => {
		const docURL = rawGitHubURL + encodeURI(doc.path);

		const docText = await getOnlineRaw(docURL);
		docText
			.split("\n")
			.filter((line) => line.startsWith("#"))
			.forEach((headingLine) => {
				const headerName = headingLine.replace(/^#+ /, "")
				const area = doc.path.slice(3, -3)

				const url = (doc.path.slice(3) + "#" + headerName).replaceAll(" ", "+")
				jsonArray.push({
					title: headerName,
					subtitle: area,
					uid: url,
					match: alfredMatcher(headerName),
					arg: url,
				});
			});

	});

	// COMMUNITY DOCS
	const communityDocs = communityDocsJSON.tree
		.filter((/** @type {{ path: string; }} */ item) => item.path.slice(-3) === ".md")
		.filter((/** @type {{ path: string; }} */ item) => !item.path.startsWith(".github/"));

	communityDocs.forEach((/** @type {{ path: string; }} */ item) => {
		const area = item.path.split("/").slice(1, -1).join("/");
		const url = communityDocsURL + item.path.replaceAll(" ", "+");
		const title = (item.path.split("/").pop() || "error").slice(0, -3);

		jsonArray.push({
			title: title,
			match: alfredMatcher(title),
			icon: { path: "icons/community-vault.png" },
			subtitle: area,
			uid: url,
			arg: url,
		});
	});

	return JSON.stringify({
		items: jsonArray,
		cache: { seconds: 60 * 60 * 24 * 7, loosereload: true },
	});
}

// @ts-ignore
process.stdout.write(await run());
