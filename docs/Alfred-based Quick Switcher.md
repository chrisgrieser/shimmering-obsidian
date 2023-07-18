# Alfred-based Quick Switcher
The Alfred-based Quick Switcher is basically an enhanced version of [Obsidian's Quick Switcher Core Plugin](https://help.obsidian.md/Plugins/Quick+switcher).

<img src="https://user-images.githubusercontent.com/73286100/139678407-9ac39baa-5f49-42a0-9622-0fbaf68540b2.gif" alt="promo video" width=70%>

## Table of Contents
<!--toc:start-->
- [How the Search works](#how-the-search-works)
- [Main Search](#main-search)
  - [Search for Notes](#search-for-notes)
  - [Smart Queries](#smart-queries)
  - [Search for Aliases](#search-for-aliases)
  - [Search for Folders](#search-for-folders)
  - [Search for Headings](#search-for-headings)
- [Browse Links of a Note](#browse-links-of-a-note)
- [Search Notes by their Tags](#search-notes-by-their-tags)
- [Search Bookmarked Files](#search-bookmarked-files)
- [Search Recent Files](#search-recent-files)
- [Search for Attachments](#search-for-attachments)
- [Extra Features](#extra-features)
  - [Supercharged Icons](#supercharged-icons)
  - [Privacy Mode](#privacy-mode)
  - [Vault Search as Alfred Fallback](#vault-search-as-alfred-fallback)
  - [Previewing Notes via QuickLook](#previewing-notes-via-quicklook)
<!--toc:end-->

## How the Search works
All the search features listed here do not *directly* search your vault, but rather use the metadata created by the [Metadata Extractor Plugin](https://obsidian.md/plugins?id=metadata-extractor) on a regular basis. By default, this happens every 30 minutes, meaning recently created notes, recently renamed notes, or recent tag changes are not picked up at once. You can change the metadata refresh rate via the Metadata Extractor Plugin's settings.

## Main Search
**`o`: Open files in your vault.**
This keyword searches all your notes, aliases, folders, and headings combined.

### Search for Notes
This works similar to Obsidian's built-in *Quick Switcher*, but can be triggered without Obsidian running (in which case it opens Obsidian with the selected note). Press `↵` to open the selected file in Obsidian.
- `⌘ + ↵`: Open the file in a new tab (requires Obsidian 0.16).
- `⌥ + ↵`: Reveal the file in Finder.
- `fn + ↵`: Append the content to the selected note.
- `⌃ + ↵`: Copy the [Obsidian-URI to the selected file](https://help.obsidian.md/Advanced+topics/Using+obsidian+URI#Action+`hook-get-address`).
- `⇧ + ↵`: Browse a list of all links of the selected note (outgoing links, backlinks, external links.) See at the [section "Browse Links" below](#browse-links-of-a-note) for further information.
- Press `⇧` or `⌘ y` to preview the selected note via macOS' Quick Look feature. Press `⇧` or `⌘ y` again to close the preview. This feature requires [QLMarkdown or Peek](#previewing-notes-via-quicklook) being installed.
- 💡 The `o`-search respects the `Excluded Files` setting from Obsidian and ignore files and folders added there. (Regex-Filters do not work properly though.)
- ℹ️ There are various settings for appending and opening notes, which can be found in the workflow configuration.

### Smart Queries
- Add `filename` or `title` to your search query, to display only files and no aliases, folders, or headings. For example, `o obsidian filename` displays only notes that have the `obsidian` in their filename.
- Add `canvas` to your search to only display canvases (Obsidian 1.1).
- Similarly, you can also filter for starred or recent files by adding `starred` or `recent` to your query.
- You can add `#tag` to your search query to search only for files with a specific tag, for example, `o foobar #moc` only displays notes with the name `foobar` that are also tagged with `#moc`.

### Search for Aliases
This command also looks for **aliases**, when they are [defined in the YAML-Header](https://help.obsidian.md/How+to/Add+aliases+to+note#Set+aliases).
- Add `alias` to your search query, to only display aliases, for example, `o obsidian alias` only displays notes that have the *alias* `obsidian`.

### Search for Folders
When **selecting a folder**, you **"browse"** the selected folder—this means that you are now searching only for files and folders inside that folder.
- When browsing a folder, you also have the option to create a new note *in that folder*. Uses the template note defined with the setting `template_note_path`.
- Furthermore, you can go up and browse the *parent* folder of the current folder. Basically, you can fully explore the folder structure of your vault via Alfred.
- Add `folder` to your search query, to only display folders, for example, `o foobar folder` only displays *folder* that have `foobar` in their name.
- When you are browsing inside a folder, use the query `..` or the `new` to quickly access the item for going up to the parent folder or creating a new note in that folder, respectively.

### Search for Headings
Displayed alongside the other search results are all headings in your vault. Selecting a heading with `↵` opens the file *at the respective heading*.
- `⌃ + ↵`: Copies either a Markdown link [that uses the Obsidian URI](https://help.obsidian.md/Advanced+topics/Using+obsidian+URI#Action+%60hook-get-address%60) or the wikilink to the selected file, depending on the setting. Also work with headings.
- Add `heading` to your search query, to only display headings, for example, `o foobar heading` only displays *headings* that include `foobar`.
- Add `h1`, `h2`, … to your search query, to only display headings of a certain level, for example, `o obsidian h2` only displays *level 2 headings* that include `obsidian`.
- You can ignore certain (or all) heading levels with the respective workflow configuration.
- 💡 **Recommendation**: Add more heading levels to `h_lvl_ignore` if your search results become too crowded.

## Browse Links of a Note
**`ol`: Browse `l`inks of the current note**

**OR use `⇧ + ↵` on any search result of the main `o` search to browse the links of that note**

- Displays a list of *all* links of the note: outgoing links, backlinks, and external links. (As of now, unresolved internal links are not displayed though.)
- Selecting an outgoing link or backlink opens the respective note.
	- All the modifiers (`⌘/⌃/⌥/fn/⇧ + ↵`) apply the same way as with the main `o` search.
	- **Yes, this means you can repeatedly use `⇧ + ↵` to basically traverse your graph via Alfred. 😎**
- for external links:
	- Selecting an external link with `↵` opens the link in the default browser.
	- Press `⌥ + ↵` on an external link to copy the URL to the clipboard instead.

## Search Notes by their Tags
**`ot`: Search `t`ags and subsequently files with that tag**
- Display and search a full list of all tags in your vault.
	- Select a tag with `↵` to display & search all notes with that tag.
	- In the following list of your notes, all the modifiers (`⌘/⌃/⌥/fn/⇧ + ↵`) apply the same way as they do with the `o` search.
	- Press `⌘ + ↵` instead to open Obsidian's search pane and search for the tag there.
- Use the workflow configuration to set whether nested tags should be merged with their parent or not.

## Search Bookmarked Files
**`ob`: Search `b`ookmarked Files and Searches**
- When you select a starred *file*, all the modifiers (`⌘/⌃/⌥/fn/⇧ + ↵`) apply the same way as with the main `o` search.
- If you select a starred *search*, Obsidian opens the search pane with the respective query.
- This feature requires the [Bookmark core plugin](https://help.obsidian.md/Plugins/Bookmarks) being enabled.

## Search Recent Files
**`or`: Open `r`ecent Files**
- All the modifiers (`⌘/⌃/⌥/fn/⇧ + ↵`) apply the same way as with the main `o` search.
- Only the 10 most recent files are displayed.

## Search for Attachments
**`oa`: `a`ttachment Search**
- Searches only for attachments (non-Markdown files) in your vault. `↵` opens the selected files in your default app. (Obsidian itself is not opened.)
- The modifiers `⌘/⌃/⌥ + ↵` and the previewing (`⇧` or `⌘y`) work the same way as with the main `o` search.
- `⇧ + ↵`, however, works differently: it opens the file in Obsidian, if
[Obsidian is able to open them](https://help.obsidian.md/Advanced+topics/Accepted+file+formats). (If not, the file simply is opened in your default app.)


## Extra Features

### Supercharged Icons
You can prepend or append icons to the results of any search based on the notes' tags, similar to the [Supercharged Links Plugin](https://obsidian.md/plugins?id=supercharged-links-obsidian).
- To do so, you have to add a file containing your emojis to the workflow configuration `Supercharged Icons`.
- Every line of the file should represent a pair of tag and emoji to be assigned, separated by `,`. Use `,,` so that the emoji gets appended instead of prepended.
- Example:

	```csv
	coding,💻
	person,👤
	seedling,,🌱
	pkm,🧠,💡
	```

	…will result in:

	```text
	💻 Filename1
	👤 Filename2
	Filename3 🌱
	🧠 Filename4 💡
	```

### Privacy Mode
When the "Privacy Mode" checkbox is enabled, all notes with the cssclass `private` are censored when performing a search. This setting is meant to be enabled temporarily, for example during screen-sharing.

### Vault Search as Alfred Fallback
The main search (`o`) can also be used as [Fallback Search for Alfred](https://www.alfredapp.com/help/features/default-results/fallback-searches/), basically a search that shows up when any Alfred search has no result.

### Previewing Notes via QuickLook
To avoid accidentally triggering the Quick Look feature, I suggest you turn off activating Quick Look via shift and use `⌘ + Y` instead. You can do so with in the Alfred Settings under `Features → Previews`:

<img src="https://i.imgur.com/hDut8wK.png" alt="" width=60%>

[QLmarkdown](https://github.com/sbarex/QLMarkdown) and [Peek](https://apps.apple.com/app/peek-quick-look-extension/id1554235898) both enable previewing of Markdown documents. Peek works with a wide range of other file types than Markdown, but costs around 5€. `QLMarkdown` is free, but only works for Markdown and requires some minor setup.

<details>
- The app `QLMarkdown.app` must be started at least once. You may need to right-click the app and select `open`, to be able to allow macOS to trust the app.
- To enable proper display of YAML headers, you need to enable the respective setting in the Advanced Options of QLMarkdown:

<img width="654" alt="" src="https://user-images.githubusercontent.com/73286100/144729141-72d8cd41-8e45-43e0-a11a-ce98ba97c2ac.png">
</details>
