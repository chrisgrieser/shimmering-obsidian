[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Troubleshooting

<!-- MarkdownTOC -->

- [Common Solutions](#common-solutions)
- [Reporting Bugs](#reporting-bugs)

<!-- /MarkdownTOC -->

## Common Solutions
- Make sure that all requirements are properly installed. 
- Update to the [latest version of the workflow](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest), chances are the problem has already been fixed.
- I read the [Breaking Changes Documentation](Breaking%20Changes.md) to make sure the unexpected behavior is not a breaking change.
- If the [Alfred-based Quick Switcher](Alfred-based%20Quick%20Switcher.md) (`o ...` search ) does not work at all, make sure you haven't changed any of the default settings of the [Metadata-Extractor regarding the location & name of the JSON files](Workflow%20Configuration.md#Metadata-Extractor-Configuration). You can also rerun `osetup` to make sure.
- If the [Quick Switcher of this workflow](Alfred-based%20Quick%20Switcher.md) cannot find a newly created or renamed note, but can otherwise find all other notes, you need to [use the `oupdate` command to refresh your metadata](Utility%20Features.md#%E2%9C%B4%EF%B8%8F-update-plugins--metadata). You should also consider [increasing the frequency of metadata refreshing](Workflow%20Configuration.md#Metadata-Extractor-Configuration).
- In case the previewing of markdown notes via `⇧` or `⌘ Y` does not work properly, make sure you have properly installed [QLMarkdown or Peek](Installation.md#qlmarkdown-or-peek).
- The first time you use the [one of the screenshot features](Screenshot%20Features.md), you might need to give Alfred permission to record your screen. You can do so under the macOS system settings (see image below).
- If you are using *Shimmering Obsidian* with a second vault, remember that you have to install the required plugins in the new vault as well, and then run `osetup` in the new vault, too. 
- When a new feature does not work, update to the newest version of the Advanced URI Plugin and the Metadata Extractor Plugin, since it is likely that they will depend on it.

<img src="https://user-images.githubusercontent.com/73286100/131231644-a800c0b0-8dc2-4ae9-bd41-c3937741b94a.png" alt="Permissions for OCR Screenshots" width=35%>

## Reporting Bugs
- If you did all of the above and there is still something not working, create an [issue on GitHub](https://github.com/chrisgrieser/shimmering-obsidian/issues). 
- Be sure to attach a debugging log, version information a screenshot, and/or a [screen recording](https://support.apple.com/guide/quicktime-player/record-your-screen-qtp97b08e666/mac). 
- You can get a **debugging log** by opening the workflow in Alfred preferences and pressing `⌘ D`. A small window will open up which will log everything happening during the execution of the Workflow. Use the malfunctioning part of the workflow once more, copy the content of the log window, and attach it.
- Running the command `odebug` will copy some version information to your clipboard, which is also useful for debugging.

[⬆️ Go Back to Top](#Table-of-Contents)
