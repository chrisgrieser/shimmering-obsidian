---
nav_order: 2
---

# Plugin & Theme Search

## Table of Contents
<!-- MarkdownTOC -->

- [Plugins](#plugins)
- [Themes](#themes)
- [Searching GitHub Issues](#searching-github-issues)

<!-- /MarkdownTOC -->

## Plugins

---

💡 After upgrading to Workflow Version 2.10, the Hotkey Helper isn't a requirement for the plugin search anymore, but you need to upgrade to Obsidian v, 0.13.14+ for the Plugin Search to work.

---

**`op`: Combined Search of community `p`lugins and community themes.**
- Press `↵` to open the plugin in Obsidian's Community Plugin Browser.
	- Use `⌘ + ↵` to open the plugin's GitHub repository instead.
	- Press `⌥ + ↵` to copy the plugin URI (`obsidian://show-plugin?id=...`) to your clipboard. When Discord is the frontmost app, the copied link will be surrounded with `<` `>` for more convenient pasting in the Discord Desktop app (disables auto-preview).
	- `⇧ + ↵` to display & search the GitHub issues. See [the section below](#-Searching-GitHub-Issues) for more information.
	- *Holding* `⌃` will display download numbers, author, and plugin ID.[^2] This is useful, when the plugin description is so long, that you cannot see this anymore.
	- _⚙️ For developers:_ Use `fn + ↵` to clone the GitHub Repository into the folder specified in the [workflow configuration](Workflow%20Configuration.md#Plugin-and-Theme-Search) (`download_folder_path`) via `git clone` (http).
	- _⚙️ For developers:_ *Pressing* `⌃ + ↵` will copy the plugin ID to the clipboard.
- Only plugins officially included in the community plugins are displayed — plugins solely available via GitHub or still in review are not shown.
- Add `plugin` to the search query to only display themes, e.g., use `op focus plugin` as search query to only display *plugins* with the term `focus`.
- The `op` search will also consider the name of the plugin's author, meaning the query `op JaneDoe` will return all plugins (and themes) authored by the user `JaneDoe`.
- The thousand separator used with the download numbers can be set in the [workflow configuration](Workflow%20Configuration.md#Plugin-and-Theme-Search) (`thousand_seperator`).

💡 To open local plugin folders and access settings of beta plugins, use the [Settings & Local Plugin Search](Settings%20and%20Local%20Plugin%20Search.md).

## Themes
**`op`: Combined Search of community `p`lugins and community themes.**
- Press `↵`[^3] to open the theme's GitHub Repository. (There are no separate theme pages in Obsidian Theme Browser that can be opened.)
	- Press `⌥ + ↵` to copy the GitHub repository URL to your clipboard. When Discord is the frontmost app, the copied link will be surrounded with `<` `>` for more convenient pasting in the Discord Desktop app (disables auto-preview).
	- `⇧ + ↵` to display & search the GitHub issues. See [the section below](#-Searching-GitHub-Issues) for more information.
	- Use `⇧` or `⌘ + Y` to open a Quick Look Preview of the theme's promo screenshot. Press `⇧` or `⌘ + Y` again to close the preview.
	- _🎨 For Theme Designers:_ Use `fn + ↵` to download the main .css file of the theme into the folder specified in the [workflow configuration](Workflow%20Configuration.md#Plugin-and-Theme-Search) (`download_folder_path`).
- Only themes officially included in the community themes are displayed — themes solely available via GitHub or still in review are not shown.
- Add `theme` to the search query to only display themes, e.g., use `op focus theme` as search query to only display *themes* with the term `focus`.
- The `op` search will also consider the name of the theme's author, meaning the query `op JaneDoe` will return all themes (and plugins) authored by the user `JaneDoe`.

<img src="https://user-images.githubusercontent.com/73286100/131027623-5e8b3667-d00d-47dc-ba49-6938686e2aca.gif" alt="plugin search" width=60%>

## Searching GitHub Issues
**Triggered by pressing `⇧ + ↵` on a plugin or theme. Will display a list of its GitHub issues.**
- The list will display the open/closed status, author, and number of comments. The list of issues can be searched like any Alfred Search.
- You can also choose to create a new issue, pre-populated as Feature Request or Bug Report. 
- Use `⌥ + ↵` on an issue to copy the issue URL to the clipboard.
- 💡 To avoid unnecessary issues, the creation of new issues is *disabled* when the local version of the plugin is outdated. Instead, you will be provided with a quick shortcut to update the plugin 🙂
- ℹ️ Due to restrictions of the GitHub API, only the most recent 100 issues can be displayed.

<img src="https://user-images.githubusercontent.com/73286100/139559362-747b0c57-c29b-45b5-bc62-4ab53c0718c5.gif" alt="Issue Search" width=60%>
<img src="https://i.imgur.com/AvavR7n.png" alt="update information" width=60%>



[^1]: Unfortunately, there isn't enough versioning information for themes to do the same for them.
[^2]: Accessing the settings of an installed plugin via [the plugin search](Plugin%20and%20Theme%20Search.md) (`op`) via `ctrl + ↵` has been disabled in release 2.4.
[^3]: For consistency with the plugin search, this also works with `⌘ + ↵`.
