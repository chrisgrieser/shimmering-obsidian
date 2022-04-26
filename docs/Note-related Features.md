---
nav_order: 2
---

# Note-related Features

## Table of Contents
<!-- MarkdownTOC -->

- [Create a new Note](#create-a-new-note)
- [Scratchpad](#scratchpad)
- [Daily Notes \(deprecated\)](#daily-notes-deprecated)

<!-- /MarkdownTOC -->

## Create a new Note
__`on` or `triggered via hotkey`: Create a `n`ew note.__
- __File Name:__ Anything you type after the keyword `on` (e.g., `on foobar`) will become the filename of the new note (e.g., `foobar.md`). (Note that the [Filename Heading Sync Plugin](https://obsidian.md/plugins?id=obsidian-filename-heading-sync) may interfere with this.)
- __Content:__ You can select a template note to use for the new note with the [workflow configuration](Workflow%20Configuration.md#note-related-features) `template_note_path`. Be aware that the template will be ignored when you use Folder Templates from the [Templater plugin](https://obsidian.md/plugins?id=templater-obsidian). Any `{{title}}` placeholders in the template will be replaced with the name of the file.
- __Location:__ The new note will be placed in the folder specific in the [workflow configuration](Workflow%20Configuration.md#note-related-features) `new_note_location`. If the configuration is left empty, it will be placed in your vault root.
- This command also works when Obsidian is not running (in which case it will open Obsidian after note creation).
- When triggered via __hotkey__, will append the current selection.
- If you have set the [workflow configuration](Workflow%20Configuration.md#note-related-features) `use_quickadd` to `true`, this command will instead trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd). Anything you type after the keyword `on` (e.g., `on foobar`) will be passed to search the QuickAdd choices. File Name, Location, and Content will be determined by QuickAdd and not this workflow.

## Scratchpad
__`oo` or `triggered via hotkey`: Append to your Scratchpad Note__
- Quickly add text to the note set in the [workflow configuration](Workflow%20Configuration.md#note-related-features) `scratchpad_note_path`. (This command is basically a quicker version of the `fn + ↵` mode of the [Alfred-based Quick Switcher](Alfred-based%20Quick%20Switcher.md#search-for-notes).)
	- When using `oo foobar`, will append `foobar` to the note.
	- When triggered via __hotkey__, will append the current selection.
	- When you append `#foobar` to `scratchpad_note_path` (e.g. `Inbox/Scratchpad-Note#Thoughts`), the text will be added below the heading "foobar" located in that note.
- The text set in the [workflow configuration](Workflow%20Configuration.md#Alfred-based-Quick-Switcher) `scratchpad_append_prefix` will be inserted in front of the input text.
- If the [workflow configuration](Workflow%20Configuration.md#Alfred-based-Quick-Switcher) `open_after_appending` is set to `true`, will open the scratchpad afterwards.
- 💡 Using `- [ ]` as prefix and inserting below a specific heading enables you to add cards to a Kanban Board.

## Daily Notes (deprecated)
__`od`: Open & Append to today's daily note [settings].__
- Either open today's daily note or append to today's daily note.
- This feature works without Obsidian running, since when appending, your daily note will not be opened.
- Use `cmd + ↵` to open your daily note after appending to it.
- This does *not* require the Daily Notes plugin to be enabled.
- For now, the daily notes must be exactly in the format `YYYY-MM-DD` for this feature to work.
- Using the [workflow configuration](Workflow%20Configuration.md#note-related-features) `daily_note_path`, you can set the location of your daily notes inside your vault.
- The text set in the [workflow configuration](Workflow%20Configuration.md#Alfred-based-Quick-Switcher) `daily_note_append_prefix` will be inserted in front of the input text.

ℹ️ *Since I do not use daily notes myself, I find it hard to maintain continuously improve this the daily note feature, which is why I am deprecating this. I encourage you to check out the [Alfred workflow for Obsidian by hauselin](https://github.com/hauselin/obsidian-alfred), which focuses on daily notes and complements this workflow quite nicely.*
