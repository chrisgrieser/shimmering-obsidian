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
	const allDocs = [];
	const officialDocsURL = "https://help.obsidian.md/";
	const officialDocsJSON = await getOnlineJson(
		"https://api.github.com/repos/obsidianmd/obsidian-docs/git/trees/master?recursive=1",
	);

	const rawGitHubURL = "https://raw.githubusercontent.com/obsidianmd/obsidian-docs/master/";
	const hubPagesURL = "https://publish.obsidian.md/hub/";
	const hubPagesJSON = await getOnlineJson(
		"https://api.github.com/repos/obsidian-community/obsidian-hub/git/trees/main?recursive=1",
	);

	// OFFICIAL DOCS
	const officialDocs = officialDocsJSON.tree.filter(
		(/** @type {{ path: string; }} */ item) =>
			item.path.slice(-3) === ".md" &&
			item.path.slice(0, 3) === "en/" &&
			item.path.slice(0, 9) !== "en/.trash",
	);

	for (const doc of officialDocs) {
		const area = doc.path.split("/").slice(1, -1).join("/");
		const url = officialDocsURL + doc.path.slice(3, -3).replaceAll(" ", "+");
		const title = (doc.path.split("/").pop() || "error").slice(0, -3);

		allDocs.push({
			title: title,
			match: alfredMatcher(title),
			subtitle: area,
			uid: url,
			arg: url,
		});

		// HEADINGS of Official Docs
		const docURL = rawGitHubURL + encodeURI(doc.path);

		const docText = await getOnlineRaw(docURL);
		docText
			.split("\n")
			.filter((line) => line.startsWith("#"))
			.forEach((headingLine) => {
				const headerName = headingLine.replace(/^#+ /, "")
				const area = doc.path.slice(3, -3)

				const url = officialDocsURL + (doc.path.slice(3) + "#" + headerName).replaceAll(" ", "+")
				allDocs.push({
					title: headerName,
					subtitle: area,
					uid: url,
					match: alfredMatcher(headerName),
					arg: url,
				});
			});
	};

	// OBSIDAN HUB
	hubPagesJSON.tree
		.filter((/** @type {{ path: string; }} */ item) => item.path.slice(-3) === ".md" && !item.path.startsWith(".github/"))
		.forEach((/** @type {{ path: string; }} */ item) => {
			const area = item.path.split("/").slice(1, -1).join("/");
			const url = hubPagesURL + item.path.replaceAll(" ", "+");
			const title = (item.path.split("/").pop() || "error").slice(0, -3);

			allDocs.push({
				title: title,
				match: alfredMatcher(title),
				icon: { path: "icons/community-vault.png" },
				subtitle: area,
				uid: url,
				arg: url,
			});
		});

	return JSON.stringify({
		items: allDocs,
		cache: { seconds: 60 * 60 * 24 * 7, loosereload: true },
	});
}

// @ts-expect-error // not installing type definitions just for this
process.stdout.write(await run());
