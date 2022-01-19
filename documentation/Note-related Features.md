[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Note-related Features

## Table of Contents
<!-- MarkdownTOC -->

- [Create a new Note](#create-a-new-note)
- [Scratchpad](#scratchpad)
- [Daily Notes](#daily-notes)
- [Move Note](#move-note)

<!-- /MarkdownTOC -->

## Create a new Note
**`on`: Create a `n`ew note.**
- Using the template set in the [workflow configuration](Workflow%20Configuration.md#note-related-features) (`template_note_path`), a new note will be created in your vault root.
- If you have set the [workflow configuration](Workflow%20Configuration.md#note-related-features) `use_quickadd` to `true`, this command will instead trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd).
- Anything you type after the keyword `on` (e.g., `on foobar`) will be used as argument:
	- Normally, this will become the filename of the note (e.g., `foobar.md`).
	- If you are using QuickAdd, this will instead search the QuickAdd options for the argument (e.g., `foobar`).
- This command also works with Obsidian not running (in which case it will open Obsidian after note creation).

## Scratchpad
**🆕 `oo` or `triggered via hotkey`: Append to your Scratchpad Note**
- Quickly add text to the note set in the [workflow configuration](Workflow%20Configuration.md#note-related-features) `scratchpad_note_path`. This command is basically a quick version of the `fn + ↵` mode of the [Alfred-based Quick Switcher](Alfred-based%20Quick%20Switcher.md#search-for-notes).
- When using `oo`, will append the text entered into Alfred, when triggered via hotkey, will append the current selection.
- When the [workflow configuration](Workflow%20Configuration.md#Alfred-based-Quick-Switcher) `open_after_appending` is set to `true`, will open the scratchpad afterwards.

## Daily Notes
**`od`: Open & Append to today's daily note [settings].**
- Either open today's daily note or append to today's daily note. 
- This feature works without Obsidian running, since when appending, your daily note will not be opened. 
- Use `cmd + ↵` to open your daily note after appending to it.
- This does *not* require the Daily Notes plugin to be enabled.
- For now, the daily notes must be exactly in the format `YYYY-MM-DD` for this feature to work.
- Using the [workflow configuration](Workflow%20Configuration.md#note-related-features) `daily_note_path`, you can set the location of your daily notes inside your vault.

## Move Note
**`om` or `triggered via hotkey`: Move the current note to a different folder in your vault.**
- This fully replicates the functionality of the `Move File to another folder`.
- 💡 The reason for this command is that the `Move File to another folder` is only available when the file explorer core plugin is enabled. However, some users of this Alfred workflow (including myself) prefer to fully navigate their vault via Alfred, so that the file explorer isn't really needed anymore — the move command is basically the last thing stopping you from simply deactivating the file explorer plugin.
