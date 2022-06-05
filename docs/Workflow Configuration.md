---
nav_order: 2
---

# Workflow Configuration

## Table of Contents
<!-- MarkdownTOC -->

- [Alfred Environment Variables](#alfred-environment-variables)
	- [Alfred-based Quick Switcher](#alfred-based-quick-switcher)
	- [Note-related Features](#note-related-features)
	- [Screenshots Features](#screenshots-features)
	- [Plugin & Theme Search](#plugin--theme-search)
	- [Backups](#backups)
	- [Miscellaneous](#miscellaneous)
	- [Internal](#internal)
- [Setting up the Hotkeys](#setting-up-the-hotkeys)
- [For Users familiar with Alfred](#for-users-familiar-with-alfred)
- [Default Terminal](#default-terminal)
- [Metadata Extractor Plugin Configuration](#metadata-extractor-plugin-configuration)

<!-- /MarkdownTOC -->

<img src="https://i.imgur.com/7YnQJ7K.png" alt="Metadata Extractor Settings" width=70%>

## Alfred Environment Variables
You access the main workflow configuration by clicking the *`[x]`* at the top right of the workflow.  
(Tutorial: [How to set Environment Variables in Alfred](https://www.alfredapp.com/help/workflows/advanced/variables/#environment))

<img src="https://i.imgur.com/swm7AaC.png" alt="Settings of this Workflow" width=40% height=40%>

### Alfred-based Quick Switcher
- `h_Ivl_ignore`: Heading levels that should be ignored in the Quick Switcher (`o` command). `h1 h6` will ignore h1 and h6, so only h2, h3, h4, and h5 show up in the Quick Switcher. `h4 h5 h6` will only show h1, h2 and h3 in the Quick Switcher. Enter `h1 h2 h3 h4 h5 h6` to ignore all headings in the Quick Switcher.
- `merge_nested_tags`: When using the `ot` search, merge all [nested tags](https://help.obsidian.md/Plugins/Tag+pane#Nested+tags) to their parent tag, e.g., `#inbox/to-read` and `#inbox/later` would both be subsumed under `#inbox`. Accepts `true` or `false`.
- `open_after_appending`: When appending to a note (`fn + ↵`), the note will automatically be opened afterwards. Accepts `true` or `false`. This setting also applies to the [Scratchpad](Note-related%20Features.md#Scratchpad) feature.
- `input_append`: What type of content is used when appending to a note (`fn + ↵`). Accepts `clipboard` or `manual` (= prompting you to enter something).

### Note-related Features
- `template_note_path`: vault-relative path to the template note to use when creating new notes with the `on` command or when browsing a folder via [the Alfred-based Quick Switcher](Alfred-based%20Quick%20Switcher.md). Be aware that the template will be ignored when you use Folder Templates from the [Templater plugin](https://obsidian.md/plugins?id=templater-obsidian).
- `new_note_location`: vault-relative path to a folder where new notes created by `on` should be created. Leave empty to create the new note in the vault root.
- `use_quickadd`: Instead of creating a new note based on a template (with the keyword `on`), will trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd). Accepted values are `true` and `false`.
- `scratchpad_note_path`: vault-relative path to your [Scratchpad](Note-related%20Features.md#Scratchpad). 	
	- When you append `#foobar` to `scratchpad_note_path` (e.g. `Inbox/Scratchpad-Note#Thoughts`), the text will be added below the heading "foobar" located in that note.
- `scratchpad_append_prefix`: String to insert before content appended to the [Scratchpad](Note-related%20Features.md#Scratchpad). Does accept dynamic content like the current date or time when you use [Alfred's Placeholder Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time).
- `append_prefix`: String to insert before content appended to a note via the Alfred-based Quick-Switcher (`fn + ↵`). Does accept dynamic content like the current date or time when you use [Alfred's Placeholder Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time).
- `daily_note_path`: *absolute* path to the folder where your daily notes are saved. See [Daily Notes](Note-related%20Features.md#Daily%20Notes).
- `daily_note_append_prefix`: String to insert before content appended to the daily note (`od`). Does accept dynamic content like the current date or time when you use [Alfred's Placeholder Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time).

### Screenshots Features
- `ocr_languages`: set language codes of Tesseract, e.g., `eng+deu` for English and German. You can find out the code for your language(s) in [this list](https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html).
- `ocr_prefix`: Set the prefix for OCR Screenshots. Does accept dynamic content like the current date or time when you use [Alfred's Placeholder Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time). Note that while not easy to see, `ocr_prefix` can have multi-line values.
- `open_after_screenshot`: When doing an OCR screenshot or an image screenshot, will open the note afterwards. Accepts `true` or `false`.
- `ocr_screenshot_file`: *Absolute* path to the *file* where the text resulting from the OCR should be saved to. When empty, will save/append the text to the file `{vault-path}/OCR-Screenshots.md`.
- `screenshot_path`: *Absolute* path to the *folder* where the image screenshots should be saved to. When empty, will save them the images to `{vault-path}/screenshots/`.

💡 "Absolute path" means you can also store it outside the vault when also turning off `open_after_screenshot`. (Images won't be embedded (`![[]]`) correctly then, though.)

### Plugin & Theme Search
- `thousand_seperator`: The thousand separator to use when download numbers are displayed, e.g., `.` or `,`.
- `download_folder_path`: Path where downloads from the `op` search should be placed. (cloned repositories for plugins or the main CSS-file for themes.)

### Backups
- `backup_destination`: Folder where the backups done by the `obackup` command should be saved.
- `max_number_of_bkps`: Maximum number of backups that should be stored at the backup destination folder. When the number is reached, every new backup cause the oldest backup to be deleted. (Decrease this number, when your backup folder becomes too big.)

### Miscellaneous
- `workspace_to_spellcheck`: Name of the Workspace where spellcheck should be turned on. Leave empty to not toggle any spellcheck setting with workspace changes. See [Workspace Switcher](Workspace%20Switcher.md).
- `auto_update`: Periodically check for updates *of this workflow* and update automatically. Accepts `true` or `false`.

### Internal
These variables are only here for internal and debugging reasons, you do not need to (and normally shouldn't) change them.

- `vault_path`: The *absolute* path to your obsidian vault.
- `vault_name_ENC`: The encoded name of you vault.

## Setting up the Hotkeys
At the top left of the workflow, there are some sky-blue fields. You need to double-click them to set the Keyboard Shortcuts you want to use for the respective commands.

<img src="https://i.imgur.com/wlpht7f.png" alt="Setting up Hotkeys" width=15%>

## For Users familiar with Alfred
You can change any keyword mentioned, like with any other Alfred workflow. All keyword triggers are located to the very left of this workflow.

## Default Terminal
You can change the default terminal used by this workflow [in the Alfred Settings](https://www.alfredapp.com/help/features/terminal/).

## Metadata Extractor Plugin Configuration
- **⚠️ Do not change any of the default values how the metadata extractor names its output files and where they are placed — otherwise this workflow won't be able to find them.**
- The *only* setting you can change is the one regarding the automatic refreshing of the metadata files. The higher the frequency, the more accurate the Quick Switcher of this Alfred workflow will become. You can also use `oupdate → Set Metadata Update Frequency` to change this setting via Alfred.
