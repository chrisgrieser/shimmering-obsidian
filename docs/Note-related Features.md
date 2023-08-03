# Note-related Features
<!--toc:start-->
- [Create a new Note](#create-a-new-note)
- [Scratchpad](#scratchpad)
- [Search all External Links in the Entire Vault](#search-all-external-links-in-the-entire-vault)
<!--toc:end-->

## Create a new Note
<!-- LTeX: enabled=false --><!-- vale off -->
__`on`: Create a `n`ew note.__
<!-- LTeX: enabled=true --><!-- vale on -->
- __File Name:__ Anything you type after the keyword `on` (for example, `on foobar`) becomes the file name of the new note (for example, `foobar.md`). (Note that the [Filename Heading Sync Plugin](https://obsidian.md/plugins?id=obsidian-filename-heading-sync) may interfere with this.)
	- When triggered via `cmd + ↵`, the new note is created in a new tab.
- __Content:__ You can select a template note to use in the workflow configuration. Only `{{title}}` is supported as placeholder and will be replaced with the file name. Be aware that the template might be overridden by Folder Templates from the [Templater plugin](https://obsidian.md/plugins?id=templater-obsidian).
- __Location:__ The new note is placed in the folder specified in the workflow configuration. If the configuration is empty, it is placed in your vault root.
- 💡 There are various settings for creating new notes in the workflow configuration.

## Scratchpad
__`oo` or `triggered via hotkey`: Append to your Scratchpad Note__
- Quickly add text to the note set in the workflow configuration. (This command is basically a quicker version of the `fn + ↵` mode of the [Alfred-based Quick Switcher](Alfred-based%20Quick%20Switcher.md#search-for-notes).)
	- When using `oo foobar`, appends `foobar` to the note.
	- Triggered via __hotkey__, appends the current selection.
	- When you append `#foobar` to `scratchpad_note_path` (for example, `Inbox/Scratchpad-Note#Thoughts`), the text is added below the heading "foobar" located in that note.
- 💡 Using `- [ ]` as prefix and inserting below a specific heading enables you to add cards to a Kanban Board.
- 💡 There are various settings for the scratchpad in the workflow configuration.

## Search all External Links in the Entire Vault
<!-- vale off -->
__`oe`: Search all `e`xternal links in your entire vault__
<!-- vale on -->
- `⏎`: Opens the link in the browser.
- `cmd + ⏎`: Reveal the link in Obsidian.
- `alt + ⏎`: Copies the URL to the clipboard.
