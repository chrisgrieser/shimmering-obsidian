[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Troubleshooting

<!-- MarkdownTOC -->

- [Common Solutions](#common-solutions)
- [Reporting Bugs](#reporting-bugs)

<!-- /MarkdownTOC -->

## Common Solutions
- Make sure both, the `Metadata Extractor` and the `Advanced URI` plugin are both installed and enabled.
- Update to the [latest version of the workflow](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest), chances are the problem has already been fixed.
- Read the [Breaking Changes Documentation](Breaking%20Changes.md) to make sure the unexpected behavior is not a breaking change.
- If the [Alfred-based Quick Switcher](Alfred-based%20Quick%20Switcher.md) (`o ...` search ) does not work at all, make sure you haven't changed any of the default settings of the [Metadata-Extractor regarding the location & name of the JSON files](Workflow%20Configuration.md#Metadata-Extractor-Configuration). You can also rerun `osetup` to make sure.
- If the [Quick Switcher of this workflow](Alfred-based%20Quick%20Switcher.md) cannot find a newly created or renamed note, but can otherwise find all other notes, you need to [use the `oupdate` command to refresh your metadata](Utility%20Features.md#%E2%9C%B4%EF%B8%8F-update-plugins--metadata). You should also consider [increasing the frequency of metadata refreshing](Workflow%20Configuration.md#Metadata-Extractor-Configuration).
- If you are using *Shimmering Obsidian* with a second vault, remember that you have to install the required plugins in the new vault as well, and then run `osetup` in the new vault, too. 

## Reporting Bugs
- If you did all of the above and there is still something not working, create an [issue on GitHub](https://github.com/chrisgrieser/shimmering-obsidian/issues). 
- Running the command `odebug` will copy some version information to your clipboard, which is also useful for debugging.

[⬆️ Go Back to Top](#Table-of-Contents)
