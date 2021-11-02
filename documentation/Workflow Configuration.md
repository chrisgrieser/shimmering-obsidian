[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Workflow Configuration
You access the main workflow configuration by clicking the *`[x]`* at the top right of the workflow.
<img src="https://i.imgur.com/swm7AaC.png" alt="Settings of this Workflow" width=40% height=40%>

## Main Settings
- `vault_path`: The *absolute* path to your obsidian vault, e.g., `/Users/pseudometa/MyVault` or `~/Documents/obsidianVault`.
- You can also configure which Vault to use with the [`ovault` command](Utility%20features.md#Change-and-Access-your-Vault).
- `oupdate` will offer you several options for updating the metadata of this workflow. You need to run "Manually Refresh Metadata" at least once before you are able to use this workflow.

## Alfred-based Quick Switcher
- `h_Ivl_ignore`: Heading levels that should be ignored in the Quick Switcher (`o` command). `h1 h6` will ignore h1 and h6, so only h2, h3, h4, and h5 show up in the Quick Switcher. `h4 h5 h6` will only show h1, h2 and h3 in the Quick Switcher. Enter `h1 h2 h3 h4 h5 h6` to ignore all headings in the Quick Switcher.
- `merge_nested_tags`: when using the `ot` search, merge all [nested tags](https://help.obsidian.md/Plugins/Tag+pane#Nested+tags) to their parent tag, e.g., `#inbox/toread` and `#inbox/later` would both be subsumed under `#inbox`. Accepts `true` or `false`.
- `open_after_appending`: When appending to a note (`fn + return`), the note will automatically be opened afterwards. Accepts `true` or `false`.

## New Note Creation
- `template_note_path`: Template to use when creating new notes with the `on` command or when browsing a folder via the `o` command.
- `use_quickadd`: Instead of creating a new note based on a template (with the keyword `on`), will trigger the [QuickAdd Plugin](https://github.com/chhoumann/quickadd). Accepted values are `true` and `false`.

## Plugin and Theme Search
- `thousand_seperator`: The thousand separator to use when download numbers are displayed, e.g., `.` or `,`.
- `download_folder_path`: Path where downloads from the `op` search should be placed. (cloned repositories for plugins or the main CSS-file for themes.)

## OCR Screenshots
- `ocr_languages`: set language codes of Tesseract, e.g., `eng+deu` for English and German. You can find out the code for your language(s) in [this list](https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html).
- `ocr_prefix`: Set the prefix for OCR Screenshots. Does accept dynamic content like the current date or time when you use [Alfred's Placeholder Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time). Note that while not easy to see, `ocr_prefix` can have multi-line values.

## Backups
- `backup_destination`: Folder where the backups done by the `obackup` command should be saved.
- `max_number_of_bkps`: maximum number of backups that should be stored at the backup destination folder. When the number is reached, every new backup cause the oldest backup to be deleted. (Decrease this number, when your backup folder becomes too big.)

## Misc
- `daily_note_path`: *absolute* path to the folder where your daily notes are saved. See [Daily Notes](Utility%20Features.md#Daily%20Notes).
- `fontformat`: format of the base64-conversion of font files, e.g., `woff2` or `ttf`.
- `workspace_to_spellcheck`: Name of the Workspace where spellcheck should be turned on. Leave empty to not toggle any spellcheck setting with workspace changes. See [Workspace Switcher](Workspace%20Switcher.md).
- `auto_update`: Periodically check for updates *of this workflow* and update automatically. Accepts `true` or `false`.

## Metadata Extractor Configuration
**⚠️ Do not change any of the default values how the metadata extractor names its output files and where they are placed — otherwise this workflow won't be able to find them.** 

The two settings you *can* change are the ones regarding the automatic refreshing of the metadata files. The higher the frequency (= lower number), the more accurate the Quick Switcher of this Alfred workflow will become.

You can change the plugins either via the Obsidian's settings menu, or more conveniently, with the `ofreq` command followed by a number. For example, `ofreq 10` will make the metadata refresh every 10 minutes. This means when using this workflow's Quick Switcher, the data will at most be 9 minutes out of date.

<img src="https://i.imgur.com/7YnQJ7K.png" alt="Metadata Extractor Settings" width=70%> <img src="https://i.imgur.com/PtNCamH.png" alt="ofreq command" width=70%>

You can also set the value to "0" to completely disable automatic updating of the metadata. In that case, you can use the `oupdate` keyword to manually refresh the metadata. For more in-detail information on the metadata extractor, refer to [the plugin's README](https://github.com/kometenstaub/metadata-extractor).

## Setting up Hotkeys
At the top left of the workflow, there are some sky-blue fields. You need to double-click them to set the Keyboard Shortcuts you want to use for the respective commands.

<img src="https://i.imgur.com/wlpht7f.png" alt="Setting Hotkeys" width=15% height=15%>

## Recommended Settings
- To avoid accidentally triggering the Quick Look feature, I suggest you turn off activating Quick Look via shift and use `cmd + Y` instead. You can do so with in the Alfred Settings under `Features → Previews`:

<img src="https://i.imgur.com/hDut8wK.png" alt="" width=60%>

## For Users familiar with Alfred
You can change any keyword mentioned, like with any other Alfred workflow. All keyword triggers are located to the very left of this workflow.
