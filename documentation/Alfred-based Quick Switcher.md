[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Alfred-based Quick Switcher
The Alfred-based Quick Switcher is basically an enhanced version of [Obsidian's Quick Switcher Core Plugin](https://help.obsidian.md/Plugins/Quick+switcher).


## Table of Contents
<!-- MarkdownTOC -->

- [Main Search](#main-search)
	- [Search for Notes](#search-for-notes)
	- [✴️ Search for Aliases](#%E2%9C%B4%EF%B8%8F-search-for-aliases)
	- [✴️ Search for Folders](#%E2%9C%B4%EF%B8%8F-search-for-folders)
	- [🆕 Search for Headings](#%F0%9F%86%95-search-for-headings)
- [🆕 Browse Links of a Note](#%F0%9F%86%95-browse-links-of-a-note)
- [🆕 Search Notes via their Tags](#%F0%9F%86%95-search-notes-via-their-tags)
- [Search Starred Files](#search-starred-files)
- [Search Recent Files](#search-recent-files)

<!-- /MarkdownTOC -->

<img src="https://user-images.githubusercontent.com/73286100/139678407-9ac39baa-5f49-42a0-9622-0fbaf68540b2.gif" alt="promo video" width=70%> 

## Main Search
**`o`: Open files in your vault.**
This keyword searches all your notes, aliases, folders, and headings combined.

### Search for Notes
- This works similar to Obsidian's built-in “QuickSwitch” feature, but can be triggered without Obsidian running (in which case it will open Obsidian with the selected note). Press `↵` to open the selected file in Obsidian.
	- `⌘ + ↵`: Open the file in a new pane.
	- `⌥ + ↵`: Reveal the file in Finder.
	- `fn + ↵`: Append the content of your clipboard to the selected note. When the [workflow configuration](Workflow%20Configuration.md#Alfred-based-Quick-Switcher) `open_after_appending` is set to `true`, to open the note afterwards.
	- `⌃ + ↵`: Copy the [Obsidian-URI to the selected file](https://help.obsidian.md/Advanced+topics/Using+obsidian+URI#Action+`hook-get-address`).
	- 🆕 `⇧ + ↵`: Browse a list of all links of the selected note (outgoing links, backlinks, external links.) See at the [section "Browse Links" below](#%F0%9F%86%95%20Browse-Links-of-the-Current-Note) for further information.
	- Press `⇧` or `⌘ y` to preview the selected note via macOS' Quick Look feature. Press `⇧` or `⌘ y` again to close the preview.[^1] (Caveat: YAML-Headers aren't displayed properly.)
- Add `filename` or `title` to your search query, to display only files and no aliases, folders, or headings. For example, `o obsidian filename` will display only notes that have the `obsidian` in their filename.
- Similarly, you can also filter for starred or recent files by adding `starred` or `recent` to your query.
- You can add `#tag` to your search query to search only for files with a specific tag, e.g., `o foobar #moc` will only display notes with the name `foobar` that are also tagged with `#moc`.

### ✴️ Search for Aliases
This command also looks for **aliases**, when they are [defined in the YAML-Header](https://help.obsidian.md/How+to/Add+aliases+to+note#Set+aliases).
- ✴️ As compared to version 1.x, there is no delay anymore!
- Add `alias` to your search query, to only display aliases, e.g., `o obsidian alias` will only display notes that have the *alias* `obsidian`.

### ✴️ Search for Folders
When **selecting a folder**, you will **“browse”** the selected folder – this means that you are now searching only for files and folders inside that folder.
- When browsing a folder, you also have the ⌥ion to create a new note _in that folder_. Will use the template note defined in the [workflow configuration](Workflow%20Configuration.md#New-Note-Creation) `template_note_path`.
- 🆕 Furthermore, you can go up and browse the *parent* folder of the current folder. Basically, you can fully navigate the folder structure of your vault via Alfred.
- 🆕 Add `folder` to your search query, to only display folders, e.g., `o foobar folder` will only display *folder* that have `foobar` in their name.
- 🆕 When you are browsing inside a folder, use the query `..` or the `new` to quickly access the item for going up to the parent folder or creating a new note in that folder, respectively.

### 🆕 Search for Headings
Displayed alongside the other search results are all headings in your vault. Selecting a heading with `↵` will open the file *at the respective heading*.
- `⌃ + ↵`: Will copy the [Obsidian-URI to the selected file](https://help.obsidian.md/Advanced+topics/Using+obsidian+URI#Action+%60hook-get-address%60).
- Add `heading` to your search query, to only display headings, e.g., `o foobar heading` will only display *headings* that include `foobar`.
- Add `h1`, `h2`, … to your search query, to only display headings of a certain level, e.g., `o obsidian h2` will only display *level 2 headings* that include `obsidian`.
- Use the [workflow configuration](Workflow%20Configuration.md#Alfred-based-Quick-Switcher)`h_Ivl_ignore` to completely ignore certain heading levels.
- 💡 **Recommendation**: Add more heading levels to `h_lvl_ignore` if your search results become too crowded.

## 🆕 Browse Links of a Note
**`ol`: Browse `l`inks of the current note**

**OR use `⇧ + ↵` on any search result of the main `o` search to browse the links of that note**

- Will display a list of *all* links of the note: outgoing links, backlinks, and external links.
- Selecting an outgoing link or backlink will open the respective note.
	- All the modifiers (`⌘/⌃/⌥/fn/⇧ + ↵`) apply the same way as with the main `o` search.
	- **YES, this means you can repeatedly use `⇧ + ↵` to fully traverse your graph via Alfred! 😎**
- for external links:
	- Selecting an external link with `↵` will open the link in the default browser.
	- Press `⌥ + ↵` on an external link to copy the URL to the clipboard instead.

## 🆕 Search Notes via their Tags
**`ot`: Search `t`ags and subsequently files with that tag**
- Display and search a full list of all tags in your vault.
	- Select a tag with `↵` to display & search all notes with that tag.
	- In the subsequent list of your notes, all the modifiers (`⌘/⌃/⌥/fn/⇧ + ↵`) apply the same way as they do with the `o` search.
	- Press `⌘ + ↵` instead to open Obsidian's search pane and search for the tag there.
- If [workflow configuration](/Workflow%20Configuration.md#Alfred-based-Quick-Switcher) `merge_nested_tags` is set to `true`, all nested tags are subsumed under their parent tag, e.g., `#inbox/toread` will be displayed under the `#inbox` tag. When set to `false`, all nested tags are displayed separately.

## Search Starred Files
**`os`: Search `s`tarred Files and Searches**
- When you select a starred *file*, everything works exactly the same as the search with `o`, i.e., all the modifiers (`⌘/⌃/⌥/fn/⇧ + ↵`) apply the same way.
- If you select a starred *search*, Obsidian will open the search pane with the respective query.
- This feature requires the [Starred core plugin](https://help.obsidian.md/Plugins/Starred+notes) being enabled.

## Search Recent Files
**`or`: Open `r`ecent Files**
- Displays recent files that can be actioned on exactly the same way as the search with `o`, i.e., all the modifiers (`⌘/⌃/⌥/fn/⇧ + ↵`) apply the same way.
- Up to the 10 most recent files are displayed.


[^1]: In case the previewing of markdown notes via `⇧` or `⌘ + Y` does not work properly, you have to allow _qlmarkdown_ to be executed before you can preview markdown notes via `⇧` or `⌘ + Y` (This is due to Big Sur's high security measures). Follow the [instructions here](https://github.com/toland/qlmarkdown/issues/98#issuecomment-607733093) to do that.
