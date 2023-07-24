# Utility Features
<!--toc:start-->
  - [Backup your Vault](#backup-your-vault)
  - [CSS Files](#css-files)
  - [Open Various Folders](#open-various-folders)
  - [Update Plugins & Metadata](#update-plugins-metadata)
<!--toc:end-->

## Backup your Vault
**`obackup`: Create a `backup` of your vault.**
- Your whole vault is compressed into a *zip* file and then moved to the location you specified in the workflow configuration.
- This command respects the maximum number of backups you have set (workflow configuration `max_number_of_bkps`) to prevent taking up too much disk space. When the number is reached, every new backup causes the oldest backup to be deleted.
- The hidden folders `.obsidian` and `.trash` are included in the backup, the `.git` folder is excluded.
- 💡 Advanced users: you can use the following AppleScript snippet to trigger a backup. This is useful to create automated backups via [launchd](https://launchd.info/), [Cron jobs](https://ostechnix.com/a-beginners-guide-to-cron-jobs/), or [Keyboard Maestro](https://www.keyboardmaestro.com/main/).

```applescript
tell application id "com.runningwithcrayons.Alfred"
	run trigger "backup-obsidian" in workflow "de.chris-grieser.shimmering-obsidian"
end tell
# pass 'no sound' as argument to turn off backup confirmation sound
```

<!-- vale Google.FirstPerson = NO -->
> **Warning**  
> Please be aware that this is a simplistic backup solution. While I did not have any problems with it, this workflow comes without any warranties, as stated in [the license](https://github.com/chrisgrieser/shimmering-obsidian/blob/main/LICENSE). If you want 100% safety, please use a professional backup solution.
<!-- vale Google.FirstPerson = YES -->

## CSS Files
**`ocss`: Access your `css` files.**
- Open a CSS snippet in your default text editor.

## Open Various Folders
- `o.obsidian`: The hidden `.obsidian` folder located in your vault root is opened in Finder.
- `o.trash`: Open the hidden [`.trash` folder](https://help.obsidian.md/Advanced+topics/Deleting+files) located in your vault root is opened in Finder. (Note that you have to select `Move to Obsidian trash` in the Obsidian settings under the `Files & Links` tab before deleted files can be found here.)
- `oapplicationsupport`: Open Obsidian's Application Support folder.
- `oplugin`: The plugin folder in `.obsidian` folder is opened in Finder.
- Open your vault root with the [Vault Switcher](Vault%20Switcher.md).
- Open local plugin folders with the [Plugin Settings Search](Settings%20and%20Local%20Plugin%20Search.md).

## Update Plugins & Metadata
**`oupdate`: Update Plugins and Metadata used by this workflow**
- Update your Community Plugins (and Beta plugins installed via [the BRAT Plugin](https://github.com/TfTHacker/obsidian42-brat)).
- Re-index the data for the [Documentation Search](Documentation%20Search.md). 
- Refresh the metadata used for this workflow manually.
