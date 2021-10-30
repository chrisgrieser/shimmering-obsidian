[Go back to the Table of Content.](README.md#Feature Overview)

# Plugin & Theme Search
**`op`: Combined Search of community [p]lugins and community themes.**

## Plugins
- Press `↵` to open the plugin in Obsidian's Community Plugin Browser.
	- Use `cmd + ↵` to open the plugin's GitHub repository instead.
	- Press `opt + ↵` to copy the GitHub repository URL to your clipboard.
	- `ctrl + ↵` will open plugin configuration (when the selected plugin is installed).
	- _⚙️ For developers:_ Use `fn + ↵` to clone the GitHub Repository into the folder specified in the [workflow configuration](documentation/Workflow Configuration.md#Plugin and Theme-Search) (`download_folder_path`) via `git clone`.
	- 🆕 `shift + ↵` to display & search the GitHub issues. See [the section below](#🆕 Searching GitHub Issues) for more information.
- Only plugins officially included in the community plugins are displayed — plugins solely available via GitHub or still in review are not shown.
- The thousand separator used with the download numbers can be set in the workflow configuration (`thousand_seperator`).
- Add `plugin` to the search query to only display themes, e.g. use `op focus plugin` as search query to only display *plugins* with the term `focus`.
- The `op` search will also consider the name of the plugin's author, meaning the query `op JaneDoe` will return all plugins (and themes) authored by the user `JaneDoe`.

## Themes
- Press `↵` (or `cmd + ↵`) to open the theme's GitHub Repository. (There are no separate theme pages in Obsidian Theme Browser that can be opened.)
	- Press `opt + ↵` to copy the GitHub repository URL to your clipboard.
	- _🎨 For Theme Designers:_ Use `fn + ↵` to download the main .css file of the theme into the folder specified in the [workflow configuration](documentation/Workflow Configuration.md#Plugin and Theme-Search) (`download_folder_path`).
	- 🆕 `shift + ↵` to display & search the GitHub issues. See [the section below](#🆕 Searching GitHub Issues) for more information.
	- Use `shift` or `cmd + Y` to open a Quick Look Preview of the theme's promo screenshot. Press `shift` or `cmd + Y` again to close the preview.
- Only themes officially included in the community themes are displayed — themes solely available via GitHub or still in review are not shown.
- Add `theme` to the search query to only display themes, e.g. use `op focus theme` as search query to only display *themes* with the term `focus`.
- The `op` search will also consider the name of the theme's author, meaning the query `op JaneDoe` will return all themes (and plugins) authored by the user `JaneDoe`.

<img src="https://user-images.githubusercontent.com/73286100/131027623-5e8b3667-d00d-47dc-ba49-6938686e2aca.gif" alt="plugin search" width=60% height=60%>

## 🆕 Searching GitHub Issues
**When pressing `shift + ↵` on a plugin or theme, the GitHub issue of the plugin/theme are displayed.**
- The list will display the open/closed status, author, and number of comments. The list of issues can be searched like any Alfred Search.
- You can also choose to create a new issue, pre-populated as Feature Request or Bug Report. 
- 💡 To avoid unnecessary issues, the creation of new issues is *disabled* when the local version of the plugin is outdated. Instead, you will be provided with a quick shortcut to update the plugin 🙂 (Unfortunately, there isn't enough versioning information for themes to do the same for them.)
- ℹ️ Due to restrictions of the GitHub API, only the most recent 100 issues can be displayed.

<img src="https://user-images.githubusercontent.com/73286100/139559362-747b0c57-c29b-45b5-bc62-4ab53c0718c5.gif" alt="Issue Search" width=60%>
<img src="https://i.imgur.com/AvavR7n.png" alt="update information" width=60%>

