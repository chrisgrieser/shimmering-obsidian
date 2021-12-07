[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Troubleshooting

## Common Solutions
- Make sure that all requirements are properly installed.
- Update to the [latest version of the workflow](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest), chances are the problem has already been fixed.
- When a new feature does not work, update to the newest version of the Advanced URI Plugin and the Metadata Extractor Plugin, since it is likely that they will depend on it.
- If the [Quick Switcher of this workflow](Alfred-based%20Quick%20Switcher.md) cannot find a newly created or renamed note, but can otherwise find all other notes, you need to [use the `oupdate` command to refresh your metadata](Utility%20Features.md#%E2%9C%B4%EF%B8%8F-update-plugins--metadata). You should also consider [increasing the frequency of metadata refreshing](Workflow%20Configuration.md#Metadata-Extractor-Configuration).
- If the [Alfred-based Quick Switcher](Alfred-based%20Quick%20Switcher.md) does not work at all, make sure you haven't changed any of the default settings of the [Metadata-Extractor regarding the location & name of the JSON files](Workflow%20Configuration.md#Metadata-Extractor-Configuration). You should also make sure that there are exactly **five** `.json` files in the folder `{{your-vault-path}}/.obsidian/plugins/metadata-extractor`. (The folder `.obsidian` is hidden by default in Finder, so you might have to [make it visible first](https://www.macworld.co.uk/how-to/show-hidden-files-mac-3520878/) to be able to navigate there.)
- In case the previewing of markdown notes via `⇧` or `⌘ Y` does not work properly, read [the instructions regarding the new version of QLMarkdown](Installation.md#QLMarkdown).
- The first time you use the [OCR screenshot feature](Screenshot%20Features.md#OCR-Screenshots) , you might need to give Alfred permission to record your screen. You can do so under the macOS system settings (see image below).

<img src="https://user-images.githubusercontent.com/73286100/131231644-a800c0b0-8dc2-4ae9-bd41-c3937741b94a.png" alt="Permissions for OCR Screenshots" width=35%>

## Reporting Bugs
- If you did all of the above and there is still something not working, create an [issue on GitHub](https://github.com/chrisgrieser/shimmering-obsidian/issues). 
- Be sure to attach a debugging log, a screenshot, and/or a [screen recording](https://support.apple.com/guide/quicktime-player/record-your-screen-qtp97b08e666/mac). 
- You can get a **debugging log** by opening the workflow in Alfred preferences and pressing `⌘ D`. A small window will open up which will log everything happening during the execution of the Workflow. Use the malfunctioning part of the workflow once more, copy the content of the log window, and attach it.
