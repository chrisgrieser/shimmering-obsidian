# Shimmering Obsidian 
*An Alfred Workflow with about a dozen features for Obsidian*


[General Features](https://github.com/chrisgrieser/shimmering-obsidian#general-features)
[CSS-related features](https://github.com/chrisgrieser/shimmering-obsidian#css-related-features)
[Requirements & Installation](https://github.com/chrisgrieser/shimmering-obsidian#requirements--installation)
[Workflow Configuration](https://github.com/chrisgrieser/shimmering-obsidian#workflow-configuration)
[Credits](https://github.com/chrisgrieser/shimmering-obsidian#credits)

## Features
Most features are triggered with dedicated Alfred keywords, as with any other Alfred workflow. The emphasized letter in the following feature list is the keyword you need to use. (Some features are triggered via Hotkey or [Universal Action](https://www.alfredapp.com/universal-actions/) instead.)

### General Features
**`o`: [o]pen files in your vault.** 
- This works similar to Obsidian's built-in “QuickSwitch” feature, but can be triggered without Obsidian running (in which case it will open Obsidian with the selected note). Press `return` to open the selected file in Obsidian.
	- `return + cmd`: Open the file in a new pane.
	- `return + opt`: Reveal the file in Finder.
	- `return + fn`: Append the content of your clipboard to the selected note. Then opens the note.
	- `return + ctrl`: Copy the [Obsidian-URI to the selected file](https://help.obsidian.md/Advanced+topics/Using+obsidian+URI#Action+`hook-get-address`). 
	- Press `shift` or `cmd + y` to preview the selected note via macOS' *Quick Look* feature. Press `shift` or `cmd + y` again to close the preview. (Caveat: Unfortunately, YAML-Headers are not displayed properly.)
- This command *does* also look for **aliases**, when they are [defined in the YAML-Header](https://help.obsidian.md/How+to/Add+aliases+to+note#Set+aliases). (Searching the aliases takes a short moment, though.)
- When **selecting a folder**, you will “browse” the selected folder. This means that you are now searching only for files and folders inside that folder. This is useful for when you cannot recall a file's name or alias, but do know the folder where it is located. When browsing a folder, you also have the option to create a new note in that folder. 
- When you have set `search_ignore_attachments` in the workflow configuration to “true”, files in your **attachment folder(s) will be ignored**. This basically mimics the behavior of Obsidian's QuickSwitch.

<img src="https://i.imgur.com/niwUEa9.gif" alt="" width=60% height=60%>

**Triggered via Hotkey: Take an OCR Screenshot.** 
- Similar to the default Mac Hotkey `cmd + shift + 4`, you will be able to select part of your screen for a screenshot. However, instead of saving a screenshot, a new note will be created which contains the OCR-content of the selection.
- If the file “OCR-Screenshot” already exists in your vault root, any subsequent OCR-Screenshots will instead append to this note. This is intended for taking a lot of OCR-Screenshots in succession, e.g., during a lecture or presentation.
- For best results, you should set the proper languages of the text that is to be recognized with the workflow setting `ocr_languages`.

<img src="https://i.imgur.com/xwdl1N5.gif" alt="OCR Screenshot" width=60% height=60%>

**`oh`: Get [h]elp by searching the official [Obsidian documentation](https://help.obsidian.md/Start+here).** 
- This command mimics the search behavior on the official documentation site, meaning that it also searches for headings inside individual documentation pages. Press `return` to open in your default browser.
- `return + opt`: copy the link to your clipboard instead.
- If there are now results for your search query, you can also directly search the [Obsidian Forum](https://forum.obsidian.md/s). 
- After major updates of the Obsidian documentation, this Alfred workflow needs to recreate its index of the Obsidian documentation. You can do so by selecting the respective option when typing keyword `osettings`. (Index recreation can take a few seconds depending on your internet connection. You will be notified when it is done.)

<img src="https://i.imgur.com/RkKGrLw.gif" alt="Searching the Obsidian Documentation" width=60% height=60%>

**`on`: Create a [n]ew note.** 
- Using the template set in the workflow configuration (`template_note_path`), a new note will be created in your vault root. 
- If you have set `use_quickadd` to “true”, this command will instead trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd).
- This command also works with Obsidian not running (in which case it will open Obsidian after note creation).

**`obackup`: Create a [backup] of your vault.** 
- Your whole vault will be compressed into a *zip* file and then moved to the location you specified in the workflow configuration (`backup_destination`). There will be a notification when the backup has been completed. 
- This command will respect the maximum number of backups you have set (`max_number_of_bkps`) to prevent taking up too much disk space. When the number is reached, every new backup cause the oldest backup to be deleted.
- The hidden folders `.obsidian` and `.trash` are included in the backup.
- Advanced users: you can use the following AppleScript snippet to trigger a backup. This is useful to create automated backups via [launchd](https://launchd.info/), cron jobs, or [Keyboard Maestro](https://www.keyboardmaestro.com/main/).

```applescript
tell application id "com.runningwithcrayons.Alfred" 
	run trigger "backup-obsidian" in workflow "de.chris-grieser.shimmering-obsidian" with argument ""
end tell
```

**`op`: Search Obsidian Community [p]lugins, directly from Alfred.** 
- Press `return` to open the plugin in Obsidian's Community Plugin Browser. 
- Use `cmd + return` to open the plugin's GitHub repository instead.
- Press `opt + return` to copy the GitHub repository URL to your clipboard.
- Only plugins officially included in the community plugins are displayed — plugins solely available via GitHub or still in review will not be shown.
- The thousand separator used with the download numbers can be set in the workflow configuration (`thousand_seperator`).

<img src="https://user-images.githubusercontent.com/73286100/131027623-5e8b3667-d00d-47dc-ba49-6938686e2aca.gif" alt="plugin search" width=60% height=60%>

**`odual`: Enter [dual] mode.**
- Will open a new pane with the current note in preview mode. This means, you will have the Editor and the Preview View side-by-side.
- Note that using the [Force View Mode Plugin](https://github.com/bwydoogh/obsidian-force-view-mode-of-note) may result in the second pane opening in the wrong view.

**`osetting`: Open the Obsidian [settings].** 
- Also work when Obsidian is not running (like most commands of this workflow do).

**`otrash`: Open the [trash] folder of your vault.**
- The hidden [.trash folder](https://help.obsidian.md/Advanced+topics/Deleting+files) located in your vault root will be opened in Finder. 
- This work regardless of whether you have enabled displaying hidden files in macOS' Finder or not.
- Note that you have to select `Move to Obsidian trash` in the Obsidian settings under the `Files & Links` before deleted files can be found here.

**`o.obsidian`: Open the [.obsidian] folder of your vault.**
- The hidden [.obsidian folder](https://help.obsidian.md/Advanced+topics/Deleting+files) located in your vault root will be opened in Finder. 
- This work regardless of whether you have enabled displaying hidden files in macOS' Finder or not.

**`ovault`: Open the [trash] folder of your vault.**
- Conveniently switch the vault used by this workflow. (Currently, this workflow only works on one vault at the same time.)

*When used, this workflow automatically checks once per day for new updates. Those new updates will be automatically downloaded.*



### CSS-related Features
**`ocss`: Access your [css] files.** 
- Open a theme or CSS snippet in your default text editor.
- Open the “themes” or “snippets” folder located in `.obsidian` in Finder.
- Create a **new CSS snippet** in mere seconds: The CSS file will be placed in your snippet folder, filled with your clipboard content, named after the query you enter after `ocss`, and then opened in your default text editor. (Furthermore, this will open the Obsidian Settings in the background, to save you yet another click. 🙂)

**Triggered via Hotkey: Toggle one of your CSS snippets.**
- The snippet you wish to toggle must be set in the workflow configuration (`toggle_snippet`). 
- This feature is useful for some CSS Snippets that you regularly want to turn on and off, like e.g., the [snippet to hide URLs](https://github.com/Dmitriy-Shulha/obsidian-css-snippets/blob/master/Snippets/URLs.md), or the [snippet to garble text](https://forum.obsidian.md/t/garble-text-on-screen-to-hide-private-info-with-added-features/23143).


<img src="https://i.imgur.com/j1tyGQw.gif" alt="" width=60% height=60%>


**Triggered via Hotkey: Convert a font file to CSS with base64.**
- This will take the selected font file (e.g., `.tff` or `.woff`), convert them into 
- The Hotkey only works in Finder.
- Alternatively, you can use the [Universal Action](https://www.alfredapp.com/universal-actions/) feature form Alfred to trigger the conversion.
- The snippet you wish to toggle must be set in the workflow configuration (`toggle_snippet`). 

<img src="https://i.imgur.com/q0vKXzT.gif" alt="Conversion of CSS via universal command" width=60% height=60%>

**`ot`: Open the current [t]heme file.** 
- This will simply open the current Obsidian theme in your default text editor. 
- Will automatically retrieve which theme you have set, meaning `ot` will work correctly even when you regularly switch themes for theme development.
- Pairs well with the [Theme Picker Plugin](https://github.com/kenset/obsidian-theme-picker).

**`odefault`: Display (and search) a list of the font and color variables used in Obsidian's default theme.** 
- This will simply open the current Obsidian theme in your default text editor. 
- *Shoutout to @NothingIsLost for this feature.*

<img src="https://i.imgur.com/RPHWjtj.png" alt="" width=60% height=60%>

## Requirements & Installation
First of all, you need the [Powerpack for Alfred](https://www.alfredapp.com/powerpack/), which costs around 30€ (depending on the current exchange rate to the British Pound).

### Required Obsidian Plugins
- [Advanced URI Schemes](https://github.com/Vinzent03/obsidian-advanced-uri)
- [Hotkey-Helper](https://github.com/pjeby/hotkey-helper)
- Quick Switcher (Core Plugin) has to be enabled

### Required Third-Party Software
For the OCR Screenshot Feature and for note previews from Alfred, you need to install [Tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) and [qlmarkdown](https://github.com/toland/qlmarkdown/). With Homebrew, you can do do by running the following commands:

```bash
brew install tesseract
brew install tesseract-lang
brew install qlmarkdown
```

### Installation
Download the [latest release at GitHub](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest). Double-click the `.alfredworkflow` file.

## Workflow Configuration
After installing the workflow, you need to configure the settings of this workflow to make use of most of its features.
1) You access the main workflow configuration by clicking the *`[x]`* at the top right of the workflow (see image below). There, you have the following configuration options:
	- `vault_path`: The *absolute* path to your obsidian vault, e.g., `/User/pseudometa/MyVault` or `~/Documents/obsidianVault`. (You can change the vault that you want to control with this workflow via the `ovault` command, as described in the 'Features' section.)
	- `backup_destination`: Folder where the backups done by the `obackup` command should be saved.
	- `max_number_of_bkps`: maximum number of backups that should be stored at the backup destination folder. When the number is reached, every new backup cause the oldest backup to be deleted. (Decrease this number, when your backup folder becomes to big.)
	- `fontformat`: format of the base64-conversion of font files, e.g., “woff2”
	- `ocr_languages`: set language codes of Tesseract, e.g., `eng+deu` for English and German. See here for a full list of [Tesseract Language Codes](https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html).
	- `search_ignore_attachments`: Whether to ignore attachments when using the `o` command to access the files in your vault. Will automatically retrieve recognize the attachment folder based on your Obsidian setting. Accepted values are “true” and “false”.
	- `template_note_path`: Template to use when creating new notes with the `on` command or when browsing a folder via the `o` command.
	- `thousand_seperator`: The thousand separator to use when download numbers are displayed, e.g., `.` or `,`.
	- `toggle_snippet`: *Absolute* path to the CSS file in your snippet folder that you which to toggle via hotkey.
	- `use_quickadd`: Instead of creating a new note based on a template, will trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd). Accepted values are “true” and “false”.
2) At the top left of the workflow, there are some sky-blue fields. You need to double-click them to set the Keyboard Shortcuts you want to use for the respective commands. 
3) Users familiar with Alfred: You can change any keyword mentioned, like with any other Alfred workflow. (All keyword triggers are located to the very left of this workflow.)

<img src="https://i.imgur.com/swm7AaC.png" alt="Settings of this Workflow" width=40% height=40%>
<img src="https://i.imgur.com/wlpht7f.png" alt="Setting Hotkeys" width=15% height=15%>

---

## Credits

Many features of this plugin are only made possible by the invaluable [Advanced URI plugin](https://github.com/Vinzent03/obsidian-advanced-uri) by [@Vincent03](https://github.com/Vinzent03).

This workflow has been created by @pseudometa (Discord) aka [@chrisgrieser (GitHub)](https://github.com/chrisgrieser/).

If you find this workflow to be helpful, feel free to donate [via PayPal](https://www.paypal.com/paypalme/ChrisGrieser). In my day job, I am a PhD student in sociology, studying the governance of the app economy. Visit [my academic homepage for more information](https://chris-grieser.de/).
