[⏪ Go back to the Table of Content](README.md#Feature%20Overview)

# Workflow Configuration
You access the main workflow configuration by clicking the *`[x]`* at the top right of the workflow.
<img src="https://i.imgur.com/swm7AaC.png" alt="Settings of this Workflow" width=40% height=40%>

## Main Settings
- `vault_path`: The *absolute* path to your obsidian vault, e.g., `/Users/pseudometa/MyVault` or `~/Documents/obsidianVault`.
	- You can use `~` in place of your home folder (useful for syncing settings across devices.)
	- You can later on change the vault that you want to control with this workflow via the `ovault` keyword.
- `auto_update`: Periodically check for updates of this workflow and update automatically. Accepts `true` or `false`.

## Quick Switcher
- `h_Ivl_ignore`: Heading levels that should be ignored in the Quick Switcher (`o` command). `h1 h6` will ignore h1 and h6, so only h2, h3, h4, and h5 show up in the Quick Switcher. `h4 h5 h6` will only show h1, h2 and h3 in the Quick Switcher. Enter  `h1 h2 h3 h4 h5 h6` to ignore all headings in the Quick Switcher.
- `merge_nested_tags`: when using the `ot` search, merge all [nested tags](https://help.obsidian.md/Plugins/Tag+pane#Nested+tags) to their parent tag, e.g. `#inbox/toread` and `#inbox/later` would both be subsumed under `#inbox`. Accepts `true` or `false`.
- `open_after_appending`: When appending to a note (`fn + return`), the note will automatically be opened afterwards. Accepts `true` or `false`.

## New Note Creation
- `template_note_path`: Template to use when creating new notes with the `on` command or when browsing a folder via the `o` command.
template_note_path
- `use_quickadd`: Instead of creating a new note based on a template (with the keyword `on`), will trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd). Accepted values are `true` and `false`.

## Plugin and Theme Search
- `thousand_seperator`: The thousand separator to use when download numbers are displayed, e.g., `.` or `,`.
- `download_folder_path`: Path where downloads from the `op` search should be placed. (cloned repositories for plugins or the main CSS-file for themes.)

## OCR Screenshots
- `ocr_languages`: set language codes of Tesseract, e.g., `eng+deu` for English and German. You can find out the code for your language(s) in [this list](https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html).
- `ocr_prefix`: Set the prefix for OCR Screenshots. Does accept dynamic content like the current date or time when you use [Alfred's Placeholder Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time). Note that while not easy to see, `ocr_prefix` can have multi-line values.

## Misc
- `daily_note_path`: *absolute* path to the folder where your daily notes are saved. See[Daily Notes](documentation/Utility%20Features.md#Daily%20Notes).
- `fontformat`: format of the base64-conversion of font files, e.g., `woff2` or `ttf`.
- `workspace_to_spellcheck`: Name of the Workspace where spellcheck should be turned on. Leave empty to not toggle any spellcheck setting with workspace changes. See [Workspace Switcher](documentation/Workspace%20Switcher.md).

## Backups
- `backup_destination`: Folder where the backups done by the `obackup` command should be saved.
- `max_number_of_bkps`: maximum number of backups that should be stored at the backup destination folder. When the number is reached, every new backup cause the oldest backup to be deleted. (Decrease this number, when your backup folder becomes too big.)

## Setting up Hotkeys
At the top left of the workflow, there are some sky-blue fields. You need to double-click them to set the Keyboard Shortcuts you want to use for the respective commands.

<img src="https://i.imgur.com/wlpht7f.png" alt="Setting Hotkeys" width=15% height=15%>

## Metadata Extractor Settings
To use the metadata-extractor with this workflow, **do not change any of the default values** how the metadata files are named and where there are placed – otherwise this workflow won't be able to find them.

The two settings you can – and probably should – change are the ones regarding the automatic creation of the metadata files. In the plugin's settings, the lower the frequency is, the more accurate your Searches with the [Alfred Quick Switcher](documentation/Quick%20Switcher.md) will be.

<img src="https://i.imgur.com/7YnQJ7K.png" alt="" width=70%>

For more in-detail information on the plugin, refer to [the plugin's readme](https://github.com/kometenstaub/metadata-extractor).

## Recommended Settings
- To avoid accidentally triggering the Quick Look feature, I suggest you turn off activating Quick Look via shift and use `cmd + Y` instead. You can do so with in the Alfred Settings under `Features → Previews`:

<img src="https://i.imgur.com/hDut8wK.png" alt="" width=60%>

## For Users familiar with Alfred
You can change any keyword mentioned, like with any other Alfred workflow. All keyword triggers are located to the very left of this workflow.
