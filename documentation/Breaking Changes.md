[⏪ Go back to the Feature Overview](https://github.com/chrisgrieser/shimmering-obsidian/blob/main/README.md#feature-overview)

# Breaking Changes

## New Features in version 2.0
The features new to version 2.0 are listed in the [Feature Overview section of the README](https://github.com/chrisgrieser/shimmering-obsidian/blob/main/README.md#feature-overview) with a 🆕 emoji.

## New Requirement
⚠️ __The [Metadata Extractor Plugin](https://github.com/kometenstaub/metadata-extractor) is now a hard requirement that needs to be installed — without it, you will not be able to use this plugin anymore.__ The plugin allows Alfred to access various internal data like tags, aliases, and headings which third-party apps normally would not be able to do. (It also greatly increases the speed of this workflow!)

## Metadata Extractor Configuration
**⚠️ Do not change any of the default values how the metadata extractor names its output files and where they are placed — otherwise this workflow won't be able to find them.** 

The two settings you *can* change are the ones regarding the automatic refreshing of the metadata files. The higher the frequency (= lower number), the more accurate the Quick Switcher of this Alfred workflow will become.

You can change the plugins either via the Obsidian's settings menu, or more conveniently, with the `ofreq` command followed by a number. For example, `ofreq 10` will make the metadata refresh every 10 minutes. This means when using this workflow's Quick Switcher, the data will at most be 9 minutes out of date.

<img src="https://i.imgur.com/7YnQJ7K.png" alt="Metadata Extractor Settings" width=70%> <img src="https://i.imgur.com/PtNCamH.png" alt="ofreq command" width=70%>

For more in-detail information on the metadata extractor, refer to [the plugin's README](https://github.com/kometenstaub/metadata-extractor).

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
- removed hotkey for font-base64-conversion for decluttering. (You can still set one of your own, if you want to!)
