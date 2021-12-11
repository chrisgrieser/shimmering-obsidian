[⏪ Go back to the Feature Overview](https://github.com/chrisgrieser/shimmering-obsidian/blob/main/README.md#feature-overview)

# Utility Features

## Table of Contents
<!-- MarkdownTOC -->

- [Paste URL into selection](#paste-url-into-selection)
- [Backup your Vault](#backup-your-vault)
- [Dual Mode](#dual-mode)
- [Open Various Folders](#open-various-folders)
- [Carl](#carl)
- [Update Plugins & Metadata](#update-plugins--metadata)

<!-- /MarkdownTOC -->

## Paste URL into selection
⚠️ *Deprecated – this feature will not be further developed and potentially replaced due plugins able to achieve the same thing better.*
**`Triggered via Hotkey`: Paste URL into selection.**
- When you have text selected and an URL in your clipboard, this will automatically turn the selected text into a Markdown link with the URL from the clipboard.
- Suggested keyboard shortcut is something like `cmd + K` 
- 💡 Turn off respective hotkey in Obsidian to avoid conflicts.

 <img src="https://user-images.githubusercontent.com/73286100/133614452-ef3147bf-7cd1-4dad-9b76-880f93fdcdf8.gif" alt="paste url into selection" width=50%>

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
- `oapplicationsupport`: Open Obsidian's Application Support folder.
- `oplugin`: The plugin folder in `.obsidian` folder will be opened in Finder.
- `ocss`: Open the `themes` and `snippets` folder. (Along with your installed themes and snippets.)
- Open your vault root with the [Vault Switcher](Vault%20Switcher.md).
- Open local plugin folders with the [Plugin Settings Search](Settings%20Search.md).

## Carl
**`ocarl`: Search `carl` auto-responses. 🐢 **
- Search and paste auto-responses from the beloved Discord Bot of the [Obsidian Discord Server](https://discord.gg/veuWUTm).

## Update Plugins & Metadata
**`oupdate`: Update Plugins and Metadata used by this workflow**
- Update your Community Plugins
- Update your Beta Plugins (installed via [the BRAT Plugin](https://github.com/TfTHacker/obsidian42-brat))
- Re-index the data for the [Documentation Search](Documentation%20Search.md).
- Refresh the metadata used for this workflow manually or set an interval to refresh it automatically. See the section on [workflow configuration for more information](Workflow%20Configuration.md#Metadata-Extractor-Configuration)

[⬆️ Go Back to Top](#Table-of-Contents)
