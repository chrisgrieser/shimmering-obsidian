---
nav_order: 2
---

# Utility Features

## Table of Contents
<!-- MarkdownTOC -->

- [Backup your Vault](#backup-your-vault)
- [Open Various Folders](#open-various-folders)
- [Carl](#carl)
- [Update Plugins & Metadata](#update-plugins--metadata)

<!-- /MarkdownTOC -->

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


