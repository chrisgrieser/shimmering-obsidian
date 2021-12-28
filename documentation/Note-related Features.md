[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Note-related Features

## Table of Contents
<!-- MarkdownTOC -->

- [Create a new Note](#create-a-new-note)
- [Daily Notes](#daily-notes)
- [Move Note](#move-note)
- [Open GitHub Commit History](#open-github-commit-history)

<!-- /MarkdownTOC -->

## Create a new Note
**`on`: Create a `n`ew note.**
- Using the template set in the [workflow configuration](Workflow%20Configuration.md#New-Note-Creation) (`template_note_path`), a new note will be created in your vault root.
- If you have set the [workflow configuration](Workflow%20Configuration.md#New-Note-Creation) `use_quickadd` to `true`, this command will instead trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd).
- Anything you type after the keyword `on` (e.g., `on foobar`) will be used as argument:
	- Normally, this will become the filename of the note (e.g., `foobar.md`).
	- If you are using QuickAdd, this will instead search the QuickAdd options for the argument (e.g., `foobar`).
- This command also works with Obsidian not running (in which case it will open Obsidian after note creation).
- ℹ️ The `on` command doesn't display the results in Alfred as opposed to the other commands. SImply press enter to open Quick or the new Note in Obsidian

## Daily Notes
**`od`: Open & Append to today's daily note [settings].**
- Either open today's daily note or append to today's daily note. 
- This feature works without Obsidian running, since when appending, your daily note will not be opened. 
- Use `cmd + ↵` to open your daily note after appending to it.
- This does *not* require the Daily Notes plugin to be enabled.
- For now, the daily notes must be exactly in the format `YYYY-MM-DD` for this feature to work.
- Using the [workflow configuration](Workflow%20Configuration.md#Miscellaneous) `daily_note_path`, you can set the location of your daily notes inside your vault.

## Move Note
**`om` or `triggered via hotkey`: Move the current note to a different folder in your vault.**
- This fully replicates the functionality of the `Move File to another folder`.
- 💡 The reason for this command is that the `Move File to another folder` is only available when the file explorer core plugin is enabled. However, some users of this Alfred workflow (including myself) prefer to fully navigate their vault via Alfred, so that the file explorer isn't really needed anymore — the move command is basically the last thing stopping you from simply deactivating the file explorer plugin.

## Open GitHub Commit History
**`ogit` or `triggered via hotkey`: Open the GitHub commit history of the current note.**
- ℹ️ This requires the vault root to be a git directory. The Obsidian Git Plugin is __not__ required for this command.
- Read the excellent guide [How I Put My Mind Under Version Control](https://medium.com/analytics-vidhya/how-i-put-my-mind-under-version-control-24caea37b8a5) by Bryan Jenks on how to back up your vault on git.

[⬆️ Go Back to Top](#Table-of-Contents)
