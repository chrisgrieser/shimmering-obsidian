[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Breaking Changes

## New Requirement
⚠️ __The [Metadata Extractor Plugin](https://github.com/kometenstaub/metadata-extractor) is now a hard requirement that needs to be installed — without it, you will not be able to use this plugin anymore.__ The plugin allows Alfred to access various internal data like tags, aliases, and headings which third-party apps normally would not be able to do. (It also greatly increases the speed of this workflow!)

❗️ After installation, you need to run the `osetup` command once. You are prompted to select the vault you want to control and Obsidian will restart. Then you are ready to go!

## Metadata Extractor Configuration
- **⚠️ Do not change any of the default values how the metadata extractor names its output files and where they are placed — otherwise this workflow won't be able to find them.**
- The setting _should_ change is the one regarding the automatic refreshing of the metadata files. The higher the frequency, the more accurate the Quick Switcher of this Alfred workflow will become.

<img src="https://i.imgur.com/7YnQJ7K.png" alt="Metadata Extractor Settings" width=70%>

## List of all other Breaking Changes
*when updating from v. 1.x to 2.x*
- the previous `ot` command to open the current theme has been **removed** to avoid overlap with the new tag search – the command id now called via the `ocss` command.
- the previous `otrash` command to open the current theme has been renamed to `o.`, to avoid crowding the `ot` keyword. For consistency, and simplicity, `o.obsidian` is now also accessible via `o.`
- keyword `odefault` replaced with `ocheat`
- forum search renamed to `of` because `oh` became too crowded
- `Open in Dualmode` modifier for the `o` search is removed for now, as Alfred only allows for 5 modifiers per action.
- `osettings` keyword *for updating the documentation search* has been renamed `oupdate` for consistency.
- Attachment search removed for now, as it would crowd the now enhanced main search too much. If there is demand for it, I will implement a new, separate attachment search. [Please create a GitHub issue if you are interested in this.](https://github.com/chrisgrieser/shimmering-obsidian)
- removed CSS Snippet toggling, as there are now [multiple](https://github.com/chetachiezikeuzor/MySnippets-Plugin) [plugins](https://github.com/deathau/snippet-commands-obsidian) that do that better
- removed hotkey for font-base64-conversion for de-cluttering. (You can still set one of your own, if you want to!)

*when updating to 2.1*
- removed `osettings` command – improved version now available via the command `o,`. See [Settings-Search](Settings%20Search.md).

*when updating to 2.3*
- replaced `ovault` command with `ov`. See [Vault Switcher documentation](Vault%20Switcher.md).
- removed `ofreq` for simplification, still available via `oupdate → Set Metadata Update Frequency`

*when updating to 2.4*
- Accessing the settings of an installed plugin via [the plugin search](Plugin%20and%20Theme%20Search.md) (`op`) via `ctrl + ↵` has been disabled. Instead, *holding* `ctrl` will display download numbers, author, and plugin ID.

*when updating to 2.4.2*
- `ocheat` command abbreviated to `oc`.

*when updating to 2.8*
- Converting a font file to base64 will prompt for the format and copy to the clipboard instead of saving to the snippet folder.
- Workflow configuration `fontformat` dropped, as base64 conversion will prompt for it. 
