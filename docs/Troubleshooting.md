# Troubleshooting

## Common Solutions
- Make sure both, the `Metadata Extractor` and the `Advanced URI` plugin, are installed and enabled.
- Update to the [latest version of the workflow](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest), chances are the problem has already been fixed.
- If you are using *Shimmering Obsidian* with a second vault, remember that you have to install the required plugins in the new vault as well, and then run `osetup` in the new vault, too.

## Alfred-based Quick Switcher (`o ...` search )
- If the [Alfred-based Quick Switcher](Alfred-based%20Quick%20Switcher.md) does not work at all, make sure you haven't changed any of the default settings of the [Metadata-Extractor regarding the location & name of the JSON files](Workflow%20Configuration.md#Metadata-Extractor-Configuration). You can also rerun `osetup` to make sure.
- If notes in general can be found, but not recently created or renamed notes, you need to [use the `oupdate` command to refresh your metadata](Utility%20Features.md#%E2%9C%B4%EF%B8%8F-update-plugins--metadata). 

## Reporting Bugs
If you did all of the above and there is still something not working, create an [issue on GitHub](https://github.com/chrisgrieser/shimmering-obsidian/issues/new?assignees=&labels=bug&template=bug_report.yml&title=%5BBug%5D%3A+).
