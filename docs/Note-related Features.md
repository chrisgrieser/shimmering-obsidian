# Note-related Features

## Table of Contents
<!--toc:start-->
- [Create a new Note](#create-a-new-note)
- [Scratchpad](#scratchpad)
<!--toc:end-->

## Create a new Note
__`on` or `triggered via hotkey`: Create a `n`ew note.__
- __File Name:__ Anything you type after the keyword `on` (e.g., `on foobar`) will become the file name of the new note (e.g., `foobar.md`). (Note that the [Filename Heading Sync Plugin](https://obsidian.md/plugins?id=obsidian-filename-heading-sync) may interfere with this.)
	- When triggered via `cmd + ↵`, the new note will be created in a new tab.
- __Content:__ You can select a template note to use in the workflow configuration. Any `{{title}}` placeholders in the template will be replaced with the name of the file. Be aware that the template will be overridden by Folder Templates from the [Templater plugin](https://obsidian.md/plugins?id=templater-obsidian).
- __Location:__ The new note will be placed in the folder specified in the workflow configuration. If the configuration is left empty, it will be placed in your vault root.
- When triggered via __hotkey__, will append the current selection.
- 💡 There are various settings for creating new notes in the workflow configuration.

## Scratchpad
__`oo` or `triggered via hotkey`: Append to your Scratchpad Note__
- Quickly add text to the note set in the workflow configuration. (This command is basically a quicker version of the `fn + ↵` mode of the [Alfred-based Quick Switcher](Alfred-based%20Quick%20Switcher.md#search-for-notes).)
	- When using `oo foobar`, will append `foobar` to the note.
	- When triggered via __hotkey__, will append the current selection.
	- When you append `#foobar` to `scratchpad_note_path` (e.g. `Inbox/Scratchpad-Note#Thoughts`), the text will be added below the heading "foobar" located in that note.
- 💡 Using `- [ ]` as prefix and inserting below a specific heading enables you to add cards to a Kanban Board.
- 💡 There are various settings for the scratchpad in the workflow configuration.

