[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Breaking Changes

## Table of Contents
<!-- MarkdownTOC -->

- [Version 2.15](#version-215)
- [Version 2.12.1](#version-2121)
- [Version 2.10](#version-210)
- [Version 2.9](#version-29)
- [Version 2.8](#version-28)
- [Version 2.4.2](#version-242)
- [Version 2.4](#version-24)
- [Version 2.3](#version-23)
- [Version 2.1](#version-21)
- [Version 2.0](#version-20)
	- [Metadata Extractor Plugin](#metadata-extractor-plugin)
	- [Other breaking Changes when updating from v. 1.x to 2.x](#other-breaking-changes-when-updating-from-v-1x-to-2x)

<!-- /MarkdownTOC -->
## Version 2.15
- `odual` removed since it's implemented via plugins and Live Preview.
- Paste into Selection removed, since there is [a plugin that does it better](https://github.com/chrisgrieser/obsidian-smarter-md-hotkeys).

## Version 2.12.1
The recently introduced `ogit` command has been removed since the same functionality is now available [via a plugin](https://github.com/kometenstaub/copy-publish-url) in a more efficient manner. 

## Version 2.10
Hotkey Helper isn't a requirement for the Plugin search anymore, but you need to upgrade to Obsidian 0.13.14+ for the Plugin Search now.

## Version 2.9
After updating to version 2.9+, you need to re-run `osetup` once.

## Version 2.8
- Converting a font file to base64 will prompt for the format and copy to the clipboard instead of saving to the snippet folder.
- Workflow configuration `fontformat` dropped, as base64 conversion will prompt for it. 

## Version 2.4.2
- `ocheat` command abbreviated to `oc`.

## Version 2.4
- Accessing the settings of an installed plugin via [the plugin search](Plugin%20and%20Theme%20Search.md) (`op`) via `ctrl + ↵` has been disabled. Instead, *holding* `ctrl` will display download numbers, author, and plugin ID.

## Version 2.3
- replaced `ovault` command with `ov`. See [Vault Switcher documentation](Vault%20Switcher.md).
- removed `ofreq` for simplification, still available via `oupdate → Set Metadata Update Frequency`

## Version 2.1
- removed `osettings` command – improved version now available via the command `o,`. See [Settings-Search](Settings%20Search.md).

## Version 2.0

### Metadata Extractor Plugin
⚠️ __The [Metadata Extractor Plugin](https://github.com/kometenstaub/metadata-extractor) is now a hard requirement that needs to be installed — without it, you will not be able to use this plugin anymore.__ The plugin allows Alfred to access various internal data like tags, aliases, and headings which third-party apps normally would not be able to do. (It also greatly increases the speed of this workflow!)

❗️ After installation, you need to run the `osetup` command once. You are prompted to select the vault you want to control and Obsidian will restart. Then you are ready to go.

### Other breaking Changes when updating from v. 1.x to 2.x
- the previous `ot` command to open the current theme has been **removed** to avoid overlap with the new tag search – the command id now called via the `ocss` command.
- the previous `otrash` command to open the current theme has been renamed to `o.`, to avoid crowding the `ot` keyword. For consistency, and simplicity, `o.obsidian` is now also accessible via `o.`
- keyword `odefault` replaced with `ocheat`
- forum search renamed to `of` because `oh` became too crowded
- `Open in Dualmode` modifier for the `o` search is removed for now, as Alfred only allows for 5 modifiers per action.
- `osettings` keyword *for updating the documentation search* has been renamed `oupdate` for consistency.
- Attachment search removed for now, as it would crowd the now enhanced main search too much. If there is demand for it, I will implement a new, separate attachment search. [Please create a GitHub issue if you are interested in this.](https://github.com/chrisgrieser/shimmering-obsidian)
- removed CSS Snippet toggling, as there are now [multiple](https://github.com/chetachiezikeuzor/MySnippets-Plugin) [plugins](https://github.com/deathau/snippet-commands-obsidian) that do that better
- removed hotkey for font-base64-conversion for de-cluttering. (You can still set one of your own, if you want to!)
