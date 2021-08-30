# Shimmering Obsidian 
*An Alfred Workflow with more than a dozen features for Obsidian*

![](https://img.shields.io/github/downloads/chrisgrieser/shimmering-obsidian/total?label=Downloads&style=plastic)  ![](https://img.shields.io/github/v/release/chrisgrieser/shimmering-obsidian?label=Latest%20Release&style=plastic)

## Overview
- [General Features](https://github.com/chrisgrieser/shimmering-obsidian#general-features)
	- Search your Vault
	- Browse the Folder in your Vault via Alfred
	- Search Starred Files/Searches
	- OCR Screenshots
	- Search the Obsidian Documentation
	- Search Community Plugins/Themes and directly open them in Obsidian or GitHub
	- Create Backups of your Vault
	- Enter Dual Mode (Edit + Preview)
	- Create a new note
	- Open various folders in `.obsidian`
	- Open the Obsidian settings
- [CSS-related features](https://github.com/chrisgrieser/shimmering-obsidian#css-related-features)
	- Toggle a CSS Snippet
	- One-Click-Convert a font file to base64-CSS
	- Open your current theme CSS file
	- Search & Preview Community Themes
	- Access your themes and snippets via Alfred
	- Quickly create a new CSS snippet from clipboard content
	- Display a list of Obsidian's default variables
- [Requirements & Installation](https://github.com/chrisgrieser/shimmering-obsidian#requirements--installation)
- [Workflow Configuration](https://github.com/chrisgrieser/shimmering-obsidian#workflow-configuration)
- [Troubleshooting](https://github.com/chrisgrieser/shimmering-obsidian#troubleshooting)
- [Credits](https://github.com/chrisgrieser/shimmering-obsidian#credits)

*You also might want to check out the [Alfred workflow by @hauselin](https://github.com/hauselin/obsidian-alfred), which focusses on a very different feature set, e.g. daily notes.* 

## Usage Guide
Most features are triggered with dedicated Alfred keywords, as with any other Alfred workflow. The emphasized letter in the following feature list is the keyword you need to use. (Some features are triggered via Hotkey or [Universal Action](https://www.alfredapp.com/universal-actions/) instead.)

### General Features
**`o`: [o]pen files in your vault.** 
- This works similar to Obsidian's built-in “QuickSwitch” feature, but can be triggered without Obsidian running (in which case it will open Obsidian with the selected note). Press `return` to open the selected file in Obsidian.
	- `cmd + return`: Open the file in a new pane.
	- `opt + return`: Reveal the file in Finder.
	- `fn + return`: Append the content of your clipboard to the selected note. Then opens the note.
	- `ctrl + return`: Copy the [Obsidian-URI to the selected file](https://help.obsidian.md/Advanced+topics/Using+obsidian+URI#Action+`hook-get-address`). 
	- `shift + return`: Open the file in Dual Mode (see `odual` below for more information on Dual Mode.)
	- Press `shift` or `cmd + y` to preview the selected note via macOS' Quick Look feature. Press `shift` or `cmd + y` again to close the preview. (Unfortunately, YAML-Headers are not displayed properly.)
- This command also looks for **aliases**, when they are [defined in the YAML-Header](https://help.obsidian.md/How+to/Add+aliases+to+note#Set+aliases). (Searching the aliases takes a short moment, though.)
- When **selecting a folder**, you will **“browse”** the selected folder – this means that you are now searching only for files and folders inside that folder. 
	- When browsing a folder, you also have the option to create a new note _in that folder_ (using the template note from `template_note_path`). 
	- Furthermore, you can go up and browse the *parent* folder of the current folder. So basically, you can fully navigate the folder structure of your vault via Alfred.
- When you have set `search_ignore_attachments` in the workflow configuration to “true”, files in your **attachment folder(s) will be ignored**. This basically mimics the behavior of Obsidian's QuickSwitch.

<img src="https://i.imgur.com/niwUEa9.gif" alt="" width=60% height=60%>

**`os`: Open [s]tarred Files and Searches** 
- When you select a starred *file*, everything works exactly the same as the search with `o`, i.e. all the modifiers (`cmd/ctrl/opt/fn/shift + return`) apply the same way.
- If you select a starred *search*, Obsidian will open the search pane with the query.

**`Triggered via Hotkey`: Take an OCR Screenshot.** 
- Similar to the default Mac Hotkey `cmd + shift + 4`, you will be able to select part of your screen for a screenshot. However, instead of saving a screenshot, a new note will be created which contains the OCR-content of the selection.
- To stay in line with the other macOS keyboard shortcuts for taking screenshots, I would suggest setting this hotkey to something like `cmd + shift + 2`.
- If the file “OCR-Screenshot” already exists in your vault root, any subsequent OCR-Screenshots will instead append to this note. This is intended for taking a lot of OCR-Screenshots in succession, e.g., during a lecture or presentation.
- You can change the prefix to OCR screenshots by changing the workflow configuration `ocr_prefix`.
	- Use a different date format by following [Alfred's Placeholder-Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time).
	- You can leave `ocr_prefix` empty or insert any other fixed value (e.g. a YAML-Header). Note that while not very visible, the workflow configuration variables *do* accept multi-line values.
- For best results, you should set the proper languages to be recognized with the workflow setting `ocr_languages`.

<img src="https://i.imgur.com/xwdl1N5.gif" alt="OCR Screenshot" width=60% height=60%>

**`oh`: Get [h]elp by searching the official [Obsidian documentation](https://help.obsidian.md/Start+here).** 
- This command mimics the search behavior on the official documentation site, meaning that it also searches for headings inside individual documentation pages. Press `return` to open in your default browser.
	- `opt + return`: Copy the link to your clipboard instead.
- If there are no results for your search query, you can also directly search the [Obsidian Forum](https://forum.obsidian.md/s). 
- After major updates of the Obsidian documentation, this Alfred workflow needs to recreate its index of the Obsidian documentation. You can do so by selecting the respective option when typing keyword `osettings`. (Index recreation can take a few seconds depending on your internet connection. You will be notified when it is done.)

<img src="https://i.imgur.com/RkKGrLw.gif" alt="Searching the Obsidian Documentation" width=60% height=60%>

**`on`: Create a [n]ew note.** 
- Using the template set in the workflow configuration (`template_note_path`), a new note will be created in your vault root. 
- If you have set `use_quickadd` to “true”, this command will instead trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd).
- Anything you write the keyword `on` (e.g. `on foobar`) will be used as argument:
	-  Normally, this will become the filename of the note (e.g. `foobar.md`).
	-  If you are using QuickAdd, this will search the QuickAdd options for the argument (e.g. `foobar`).
- This command also works with Obsidian not running (in which case it will open Obsidian after note creation).

**`obackup`: Create a [backup] of your vault.** 
- Your whole vault will be compressed into a *zip* file and then moved to the location you specified in the workflow configuration (`backup_destination`). There will be a notification when the backup has been completed. 
- This command will respect the maximum number of backups you have set (`max_number_of_bkps`) to prevent taking up too much disk space. When the number is reached, every new backup causes the oldest backup to be deleted.
- The hidden folders `.obsidian` and `.trash` are included in the backup.
- Advanced users: you can use the following AppleScript snippet to trigger a backup. This is useful to create automated backups via [launchd](https://launchd.info/), cron jobs, or [Keyboard Maestro](https://www.keyboardmaestro.com/main/).

```applescript
tell application id "com.runningwithcrayons.Alfred" 
	run trigger "backup-obsidian" in workflow "de.chris-grieser.shimmering-obsidian" with argument ""
end tell
```

**`op`: Search Obsidian Community [p]lugins AND themes, directly from Alfred.** 
- Press `return` to open the plugin in Obsidian's Community Plugin Browser. (Will open the GitHub Repository for themes instead, as there is not a way to trigger the Obsidians theme browser yet.)
	- Use `cmd + return` to open the plugin's GitHub repository instead.
	- Press `opt + return` to copy the GitHub repository URL to your clipboard.
- Use `shift` or `cmd + Y` to open a Quick Look Preview of the theme. Press `shift` or `cmd + Y` again to close the preview.
- Only plugins and themes officially included in the community plugins/themes are displayed — plugins/themes solely available via GitHub or still in review will not be shown.
- Add "themes" to the keyword to only display themes (i.e., use `op themes` as keyword.).
- The thousand separator used with the download numbers can be set in the workflow configuration (`thousand_seperator`).

<img src="https://user-images.githubusercontent.com/73286100/131027623-5e8b3667-d00d-47dc-ba49-6938686e2aca.gif" alt="plugin search" width=60% height=60%>

**`odual`: Enter [dual] mode.**
- When the current note is in Editor Mode, will open a new pane with the current note in Preview Mode. When in Preview Mode, will open the new pane in Editor Mode. Basically, you will have both View Modes side by side.
- Note that using the [Force View Mode Plugin](https://github.com/bwydoogh/obsidian-force-view-mode-of-note) may result in the second pane opening in the wrong view.
- Caveat #1: Opening the new pane as [linked pane](https://help.obsidian.md/Panes/Linked+pane) is not possible right now, [as Obsidian does not expose that function via command palette](https://forum.obsidian.md/t/open-a-note-in-a-new-pane-using-the-command-palette-or-a-keyboard-shortcut/23303). `odual` is therefore only able to open an *unlinked* pane.
- Caveat #2: When you have more than one pane open, a pane that is *not* the leftmost is active, and the active pane has a different view mode than the leftmost pane, then `odual` will open in the wrong view mode. (Obsidian unfortunately does not expose enough information about the workspace state to ensure correct behavior for this  case.)

**`osetting`: Open the Obsidian [settings].** 
- Also works when Obsidian is not running (like most commands of this workflow do).

**`otrash`: Open the [trash] folder of your vault.**
- The hidden [.trash folder](https://help.obsidian.md/Advanced+topics/Deleting+files) located in your vault root will be opened in Finder. 
- This work regardless of whether you have enabled displaying hidden files in macOS' Finder or not.
- Note that you have to select `Move to Obsidian trash` in the Obsidian settings under the `Files & Links` before deleted files can be found here.

**`o.obsidian`: Open the [.obsidian] folder of your vault.**
- The hidden .obsidian folder located in your vault root will be opened in Finder. 
- This work regardless of whether you have enabled displaying hidden files in macOS' Finder or not.

**`oplugin`: Open the [plugin] folder of your vault.**
- The plugin folder in the hidden `.obsidian` folder will be opened in Finder. 

**`ovault`: Change the [vault].**
- Conveniently switch the vault used by this workflow. (Currently, this workflow only works on one vault at the same time.)


### CSS-related Features
**`ocss`: Access your [css] files.** 
- Open a theme or CSS snippet in your default text editor.
- Open the “themes” or “snippets” folder located in `.obsidian` in Finder.
- Create a **new CSS snippet** in mere seconds: The CSS file will be placed in your snippet folder, filled with your clipboard content, named after the query you enter after `ocss`, and then opened in your default text editor. (Furthermore, this will open the Obsidian Settings in the background, to save you yet another click. 🙂)

**`op themes`: Search & Preview Community [themes].**
- Press `return` to open the GitHub Repository.
- Use `opt + return` to copy the GitHub repository URL to your clipboard instead.
- Press `shift` or `cmd + Y` to open a Quick Look Preview of the theme. Press `shift` or `cmd + Y` again to close the preview.
- Only themes officially included in the community themes are displayed — themes solely available via GitHub or still in review will not be shown.
- see also the `op` keyword further above, as this is basically a filter for `op`.

<img src="https://user-images.githubusercontent.com/73286100/131255059-1a56d6e7-8c2f-4ff0-b20d-247702bb7925.gif" alt="Theme Search" width=60% height=60%>

**`Triggered via Hotkey`: Toggle one of your CSS snippets.**
- The snippet you wish to toggle must be set in the workflow configuration (`toggle_snippet`). 
- This feature is useful for some CSS Snippets that you regularly want to turn on and off, like e.g., the [snippet to hide URLs](https://github.com/Dmitriy-Shulha/obsidian-css-snippets/blob/master/Snippets/URLs.md), or the [snippet to garble text](https://forum.obsidian.md/t/garble-text-on-screen-to-hide-private-info-with-added-features/23143).

<img src="https://i.imgur.com/j1tyGQw.gif" alt="" width=60% height=60%>


**`Triggered via Hotkey`: Convert a font file to CSS with base64.**
- This will take the selected font file (e.g., `.tff` or `.woff`), convert them into base64 and write the base64-encoded font into a CSS file, which will be placed into your snippets folder.
- Alternatively, you can use the [Universal Action](https://www.alfredapp.com/universal-actions/) feature form Alfred to trigger the conversion.
- The Hotkey only works in Finder.

<img src="https://i.imgur.com/q0vKXzT.gif" alt="Conversion of CSS via universal command" width=60% height=60%>

**`ot`: Open the current [t]heme file.** 
- This will simply open the current Obsidian theme in your default text editor. 
- Will automatically retrieve which theme you have set, meaning `ot` will work correctly even when you regularly switch themes for theme development.
- Pairs well with the [Theme Picker Plugin](https://github.com/kenset/obsidian-theme-picker).

**`odefault`: Display (and search) a list of the font and color variables used in Obsidian's default theme.** 
- Select a variable with `return` to copy the name to your clipboard.
- Press `cmd + return` to copy it in the format `var(--varname)` instead.
- *Shoutout to @NothingIsLost for this feature.*

<img src="https://i.imgur.com/RPHWjtj.png" alt="" width=60% height=60%>

## Requirements & Installation

### "Hard" Requirements
These requirements need to be installed, since this workflow cannot work without them.
- [Powerpack for Alfred](https://www.alfredapp.com/powerpack/) (costs around 30€, depending on the current exchange rate to the British Pound).
- Install the [Advanced URI Plugin](https://github.com/Vinzent03/obsidian-advanced-uri) for Obsidian. (Needed to enable controling Obsidian from a third-party app like Alfred.)

### "Soft" Requirements
These requirements are only necessary for specific features of this workflow. If you do not plan to use the respective feature, you can forego installing the requirement for it. It is recommended to install all requirements listed here to be able to use all features of _Shimmering Obsidian_.

| Name                                                                   | Type                      | Function                                                                                     |
| ---------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| [Quick Switcher](https://help.obsidian.md/Plugins/Quick+switcher) (pre-installed Core Plugin; must be enabled)      | Obsidian Core Plugin      | used to open notes in a new pane                                                             |
| [Hotkey-Helper](https://github.com/pjeby/hotkey-helper)                | Obsidian Community Plugin | used to open plugins directly in the  Community Plugin Browser                          |
| [Tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) | Third-Party Software      | needed for **OCR screenshots**                                                                   |
| [qlmarkdown](https://github.com/toland/qlmarkdown/)                    | Third-Party Software      | used to preview markdown notes with  `shift` or `cmd + Y` when searching with `o` | 

If you have [Homebrew](https://brew.sh/), Tesseract and qlmarkdown can by installed via the following terminal commands:

```bash
brew install tesseract
brew install tesseract-lang
brew install qlmarkdown
```

### Installation
- Install the requirements listed above.
- Download the [latest release at GitHub](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest). Double-click the `.alfredworkflow` file.
- In some cases, you have to allow _qlmarkdown_ to be executed before you can preview markdown notes via `shift` or `cmd + Y` (This is due to Big Sur's high security measures). Follow the [instructions here](https://github.com/toland/qlmarkdown/issues/98#issuecomment-607733093) to do that.
- The first time you use the OCR screenshot feature, you might need to give Alfred permission to record your screen. You can do so under the macOS system settings (see image below).

<img src="https://user-images.githubusercontent.com/73286100/131231644-a800c0b0-8dc2-4ae9-bd41-c3937741b94a.png" alt="Permissions for OCR Screenshots" width=35% height=35%>

_When in use, this workflow checks regularly for new versions and auto-updates._

## Workflow Configuration
After installing the workflow, you need to configure the settings of this workflow to make use of most of its features.
1) You access the main workflow configuration by clicking the *`[x]`* at the top right of the workflow (see image below). There, you have the following configuration options:
	- `vault_path`: The *absolute* path to your obsidian vault, e.g., `/User/pseudometa/MyVault` or `~/Documents/obsidianVault`. 
		- You can use `~` in place of your home folder (useful for syncing settings accross devices.)
		- You can later on change the vault that you want to control with this workflow via the `ovault` command, as described in the 'Features' section.
	- `backup_destination`: Folder where the backups done by the `obackup` command should be saved.
	- `max_number_of_bkps`: maximum number of backups that should be stored at the backup destination folder. When the number is reached, every new backup cause the oldest backup to be deleted. (Decrease this number, when your backup folder becomes to big.)
	- `fontformat`: format of the base64-conversion of font files, e.g., “woff2”
	- `ocr_languages`: set language codes of Tesseract, e.g., `eng+deu` for English and German. You can find out the code for your language(s) in [this list](https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html).
	- `ocr_prefix`: Set the prefix for OCR Screenshots. Does accept dynamic content like the current date or time when you use [Alfred's Placeholder-Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time). Note that while not very visible, `ocr_prefix` _can_ have multi-line values.
	- `search_ignore_attachments`: Whether to ignore attachments when using the `o` command to access the files in your vault. Will automatically retrieve recognize the attachment folder based on your Obsidian setting. Accepted values are “true” and “false”.
	- `template_note_path`: Template to use when creating new notes with the `on` command or when browsing a folder via the `o` command.
	- `thousand_seperator`: The thousand separator to use when download numbers are displayed, e.g., `.` or `,`.
	- `toggle_snippet`: *Full* path to the CSS file in your snippet folder that you wish to toggle via hotkey.
	- `use_quickadd`: Instead of creating a new note based on a template (with the keyword `on`), will trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd). Accepted values are “true” and “false”.
2) At the top left of the workflow, there are some sky-blue fields. You need to double-click them to set the Keyboard Shortcuts you want to use for the respective commands. 
3) Users familiar with Alfred: You can change any keyword mentioned, like with any other Alfred workflow. (All keyword triggers are located to the very left of this workflow.)

<img src="https://i.imgur.com/swm7AaC.png" alt="Settings of this Workflow" width=40% height=40%>
<img src="https://i.imgur.com/wlpht7f.png" alt="Setting Hotkeys" width=15% height=15%>

## Troubleshooting
- Make sure that all requirements are properly installed.
- Check the documentation of the malfunctioning feature.
- Update to the latest version of the workflow, chances are the problem has already been fixed.
- For workflow settings which require a file or path, you have to enter the *full absolute path*, leading with a`/` and without a trailing `/`. Do *not* use a vault-relative path.
- If you have trouble with OCR screenshots, ensure you have given Alfred permission to record your screen as explained in the [Installation Instructions](https://github.com/chrisgrieser/shimmering-obsidian#installation).
- In case the previewing of markdown notes via `shift` or `cmd + Y` does not work properly, make you have given "qlmarkdown" permission run on your system as explained in the [Installation Instructions](https://github.com/chrisgrieser/shimmering-obsidian#installation).
- If you did all of the above and there is still something not working, create an [issue](https://github.com/chrisgrieser/shimmering-obsidian/issues), message me on the [Obsidian Discord Server](https://discord.gg/veuWUTm) (my username there is `@pseudometa`), or write me on Twitter where my handle is [@pseudo_meta](https://twitter.com/pseudo_meta). 
	- Be sure to attach a debugging log, a screenshot, or a [screen recording](https://support.apple.com/guide/quicktime-player/record-your-screen-qtp97b08e666/mac) so I can figure out the issue. 
	- You can get a **debugging log** by opening the workflow in Alfred preferences and pressing `cmd + D`. A small window will open up which will log everything happening during the execution of the Workflow. Use the malfunctioning part of the workflow once more, copy the content of the log window, and attach it as text file.

## Credits

Most features of this plugin are only made possible by the invaluable [Advanced URI plugin](https://github.com/Vinzent03/obsidian-advanced-uri) by [@Vincent03](https://github.com/Vinzent03).

This workflow has been created by @pseudometa ([Discord](https://discord.gg/veuWUTm)) aka [@pseudo_meta (Twitter)](https://twitter.com/pseudo_meta). If you find this workflow to be useful, feel free to donate [via PayPal](https://www.paypal.com/paypalme/ChrisGrieser). In my day job, I am a PhD student in sociology, studying the governance of the app economy. If you are interested in this subject, check out [my academic homepage](https://chris-grieser.de/) and get in touch.
