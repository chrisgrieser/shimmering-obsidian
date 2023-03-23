# Plugin & Theme Search

## Table of Contents

<!--toc:start-->
- [Plugins](#plugins)
- [Themes](#themes)
- [Discord Links](#discord-links)
- [Searching GitHub Issues](#searching-github-issues)
<!--toc:end-->

## Plugins
**`op`: combined Search of community `p`lugins and community themes.**
- Press `↵` to open the plugin in Obsidian's Community Plugin Browser.
	- Use `⌘ + ↵` to open the plugin's GitHub repository instead.
	- Press `⌥ + ↵` to copy the plugin URI (`obsidian://show-plugin?id=…`) to your clipboard.
	- `⇧ + ↵` to display & search the GitHub issues. See [the section below](#searching-github-issues) for more information.
- Only plugins officially included in the community plugins are displayed — plugins solely available via GitHub or still in review are not shown.
- Add `plugin` to the search query to only display plugin, e.g., use `op focus plugin` as search query to only display *plugins* with the term `focus`.
- The `op` search also considers the name of the plugin's author, meaning the query `op JaneDoe` returns all plugins (and themes) authored by the user `JaneDoe`.

💡 To open local plugin folders and access settings of beta plugins, use the [Settings & Local Plugin Search](Settings%20and%20Local%20Plugin%20Search.md).

## Themes
**`op`: Combined Search of community `p`lugins and community themes.**
- Press `↵` to open the theme browser. (There are no separate theme pages in Obsidian Theme Browser that can be opened.)
	- Use `⌘ + ↵` to open the theme's GitHub repository instead.
	- Press `⌥ + ↵` to copy the theme URI (`obsidian://show-theme?id=…`) to your clipboard.
	- `⇧ + ↵` to display & search the GitHub issues. See [the section below](#searching-github-issues) for more information.
	- Use `⇧` or `⌘ + Y` to open a Quick Look Preview of the theme's promo screenshot. Press `⇧` or `⌘ + Y` again to close the preview.
- Only themes officially included in the community themes are displayed — themes solely available via GitHub or still in review are not shown.
- Add `theme` to the search query to only display themes, e.g., use `op focus theme` as search query to only display *themes* with the term `focus`.
- The `op` search also considers the name of the theme's author, meaning the query `op JaneDoe` returns all themes (and plugins) authored by the user `JaneDoe`.

<img src="https://user-images.githubusercontent.com/73286100/131027623-5e8b3667-d00d-47dc-ba49-6938686e2aca.gif" alt="plugin search" width=60%>

## Discord Links
- When using `⌥ + ↵` to copy a link and Discord is the frontmost app, the link will be surrounded in angle brackets (`<>`), which disables Discord's annoying auto-preview. 
- When using `⌥ + ↵` while Discord is frontmost, or when pressing `⌘⌥ + ↵`, the plugin name and description will be added to the copied link for convenient sharing.
- Note that to detect whether Discord is the frontmost app, [Alfred's compatibility mode](https://www.alfredapp.com/help/appearance/) needs to be *disabled*. If you need to use compatibility mode, use `⌘⌥ + ↵` to force copying nice, sharable links.

## Searching GitHub Issues
**Triggered by pressing `⇧ + ↵` on a plugin or theme. Displays a list of its GitHub issues.**
- The list displays the open/closed status, author, and number of comments.
- You can search for issue title, state ("closed" / "open") or author. You can also search for an issue number by prepending `#`, e.g. `#42`.
- You can also choose to create a new issue, pre-populated as Feature Request or Bug Report.
- Use `⌥ + ↵` on an issue to copy the issue URL to the clipboard.
- 💡 To avoid unnecessary issues, the creation of new issues is *disabled* when the local version of the plugin is outdated. Instead, you are provided with a quick shortcut to update the plugin 🙂
- ℹ️ Due to restrictions of the GitHub API, only the most recent 100 issues can be displayed.

<img src="https://user-images.githubusercontent.com/73286100/139559362-747b0c57-c29b-45b5-bc62-4ab53c0718c5.gif" alt="Issue Search" width=60%>
<img src="https://i.imgur.com/AvavR7n.png" alt="update information" width=60%>
