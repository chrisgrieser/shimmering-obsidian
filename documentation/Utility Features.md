[⏪ Go back to the Feature Overview](https://github.com/chrisgrieser/shimmering-obsidian/blob/main/README.md#feature-overview)

# Utility Features

## Table of Contents
<!-- MarkdownTOC -->

- [OCR Screenshots](#ocr-screenshots)
- [Paste URL into selection](#paste-url-into-selection)
- [Move Note](#move-note)
- [Create a new Note](#create-a-new-note)
- [Backup your Vault](#backup-your-vault)
- [Dual Mode](#dual-mode)
- [Open Various Folders](#open-various-folders)
- [Daily Notes](#daily-notes)
- [Carl](#carl)
- [Update Plugins & Metadata](#update-plugins--metadata)

<!-- /MarkdownTOC -->

## OCR Screenshots

<img src="https://i.imgur.com/xwdl1N5.gif" alt="OCR Screenshot" width=60% height=60%>

**`Triggered via Hotkey`: Take an OCR Screenshot.**
- Similar to the default Mac Hotkey `cmd + shift + 4`, you will be able to select part of your screen for a screenshot. However, instead of saving a screenshot, a new note will be created which contains the OCR-content of the selection.
- 💡 _Recommendation_: To stay in line with the other macOS keyboard shortcuts for taking screenshots, use something like `cmd + shift + 2` as hotkey.
- If the file “OCR-Screenshot” already exists in your vault root, any subsequent OCR-Screenshots will instead append to this note. This is intended for taking a lot of OCR-Screenshots in succession, e.g., during a lecture or presentation.
- You can change the prefix to OCR screenshots by changing the [workflow configuration](Workflow%20Configuration.md#OCR-Screenshots) `ocr_prefix`.
	- Use a different date format by following [Alfred's Placeholder-Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time).
	- You can leave `ocr_prefix` empty or insert any other fixed value (e.g., a YAML-Header). 
	- 💡 While not very visible, the workflow configuration variables *do* accept multi-line values.
- For best results, you should set the proper languages to be recognized with the workflow setting `ocr_languages`.
- 💡 _The first time you use the OCR screenshot feature_, you might need to give Alfred permission to record your screen. You can do so under the macOS system settings (see image below).

<img src="https://user-images.githubusercontent.com/73286100/131231644-a800c0b0-8dc2-4ae9-bd41-c3937741b94a.png" alt="Permissions for OCR Screenshots" width=35%>


## Paste URL into selection
**`Triggered via Hotkey`: Paste URL into selection.**
- Basically replicates the functionality of the [plugin of the same name](https://github.com/denolehov/obsidian-url-into-selection), which unfortunately does not work anymore. 
- When you have text selected and an URL in your clipboard, this will automatically turn the selected text into a Markdown link with the URL from the clipboard.
- Suggested keyboard shortcut is something like `cmd + k` 
- 💡 Turn off respective hotkey in Obsidian to avoid conflicts.

 <img src="https://user-images.githubusercontent.com/73286100/133614452-ef3147bf-7cd1-4dad-9b76-880f93fdcdf8.gif" alt="paste url into selection" width=50%>

## Move Note
**`om` or `triggered via hotkey`: Move the current note to a different folder in your vault.**
- This fully replicates the functionality of the `Move File to another folder`.
- 💡 The reason for this command is that the `Move File to another folder` is only available when the file explorer core plugin is enabled. However, some users of this Alfred workflow (including myself) prefer to fully navigate their vault via Alfred, so that the file explorer isn't really needed anymore — the move command is basically the last thing stopping you from simply deactivating the file explorer plugin.

## Create a new Note
**`on`: Create a `n`ew note.**
- Using the template set in the [workflow configuration](Workflow%20Configuration.md#New-Note-Creation) (`template_note_path`), a new note will be created in your vault root.
- If you have set the [workflow configuration](Workflow%20Configuration.md#New-Note-Creation) `use_quickadd` to `true`, this command will instead trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd).
- Anything you type after the keyword `on` (e.g., `on foobar`) will be used as argument:
	- Normally, this will become the filename of the note (e.g., `foobar.md`).
	- If you are using QuickAdd, this will instead search the QuickAdd options for the argument (e.g., `foobar`).
- This command also works with Obsidian not running (in which case it will open Obsidian after note creation).
- ℹ️ The `on` command doesn't display the results in Alfred as opposed to the other commands. SImply press enter to open Quick or the new Note in Obsidian

## Backup your Vault
**`obackup`: Create a `backup` of your vault.**
- Your whole vault will be compressed into a *zip* file and then moved to the location you specified in the [workflow configuration](Workflow%20Configuration.md#Backups) (`backup_destination`). There will be a notification when the backup has been completed.
- This command will respect the maximum number of backups you have set ([workflow configuration](Workflow%20Configuration.md#Backups) `max_number_of_bkps`) to prevent taking up too much disk space. When the number is reached, every new backup causes the oldest backup to be deleted.
- The hidden folders `.obsidian` and `.trash` are included in the backup.
- 💡 Advanced users: you can use the following AppleScript snippet to trigger a backup. This is useful to create automated backups via [launchd](https://launchd.info/), [Cron jobs](https://ostechnix.com/a-beginners-guide-to-cron-jobs/), or [Keyboard Maestro](https://www.keyboardmaestro.com/main/).

```applescript
tell application id "com.runningwithcrayons.Alfred"
	run trigger "backup-obsidian" in workflow "de.chris-grieser.shimmering-obsidian" with argument ""
end tell
```

## Dual Mode
**`odual`: Enter [dual] mode.**
- When the current note is in Editor Mode, this will open a new pane with the current note in Preview Mode. When in Preview Mode, this will open the new pane in Editor Mode. Basically, you will have both View Modes side by side.
- Note that using the [Force View Mode Plugin](https://github.com/bwydoogh/obsidian-force-view-mode-of-note) may result in the second pane opening in the wrong view.
- Caveat #1: Opening the new pane as [linked pane](https://help.obsidian.md/Panes/Linked+pane) is not possible right now, [as Obsidian does not expose that function via command palette](https://forum.obsidian.md/t/open-a-note-in-a-new-pane-using-the-command-palette-or-a-keyboard-shortcut/23303). 
- Caveat #2: When you have more than one pane open, a pane that is *not* the leftmost is active, and the active pane has a different view mode than the leftmost pane, then `odual` will open in the wrong view mode. (Obsidian unfortunately does not expose enough information about the workspace state to ensure correct behavior for this case.)

## Open Various Folders
- `o.obsidian`: The hidden `.obsidian` folder located in your vault root will be opened in Finder.
- `o.trash`: Open the hidden [`.trash` folder](https://help.obsidian.md/Advanced+topics/Deleting+files) located in your vault root will be opened in Finder. (Note that you have to select `Move to Obsidian trash` in the Obsidian settings under the `Files & Links` tab before deleted files can be found here.)
- 🆕 `oapplicationsupport`: Open Obsidian's Application Support folder.
- `oplugin`: The plugin folder in `.obsidian` folder will be opened in Finder.
- `ocss`: Open the `themes` and `snippets` folder. (Along with your installed themes and snippets.)
- Open your vault root with the [Vault Switcher](Vault%20Switcher.md).
- Open local plugin folders with the [Plugin Settings Search](Settings%20Search.md).

## Daily Notes
**`od`: Open & Append to today's daily note [settings].**
- Either open today's daily note or append to today's daily note. 
- This feature works without Obsidian running, since when appending, your daily note will not be opened. 
- Use `cmd + ↵` to open your daily note after appending to it.
- This does *not* require the Daily Notes plugin to be enabled.
- For now, the daily notes must be exactly in the format `YYYY-MM-DD` for this feature to work.
- Using the [workflow configuration](Workflow%20Configuration.md#Miscellaneous) `daily_note_path`, you can set the location of your daily notes inside your vault.

## Carl
**`ocarl`: Search `carl` auto-responses. 🐢 **
- Search and paste auto-responses from the beloved Discord Bot of the [Obsidian Discord Server](https://discord.gg/veuWUTm).

## Update Plugins & Metadata
**`oupdate`: Update Plugins and Metadata used by this workflow**
- Update your Community Plugins
- Update your Beta Plugins (installed via [the BRAT Plugin](https://github.com/TfTHacker/obsidian42-brat))
- Re-index the data for the [Documentation Search](Documentation%20Search.md).
- Refresh the metadata used for this workflow manually or set an interval to refresh it automatically. See the section on [workflow configuration for more information](Workflow%20Configuration.md#Metadata-Extractor-Configuration)

