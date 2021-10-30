# README

## Shimmering Obsidian 🎩
*An Alfred Workflow with dozens search features for Obsidian*

![](https://img.shields.io/github/downloads/chrisgrieser/shimmering-obsidian/total?label=Downloads&style=plastic)![](https://img.shields.io/github/v/release/chrisgrieser/shimmering-obsidian?label=Latest%20Release&style=plastic)

## [Breaking Changes](documentation/Breaking Changes.md)
When updating from version 1.x to version 2.x, there are some breaking changes to some commands. But most importantly, this plugin now requires the [metadata extractor plugin](https://github.com/kometenstaub/metadata-extractor) to run most of its functionality.

Please refer to [this document](Breaking%20Changes.md) for more in-detail information on breaking changes.

## Feature Overview
- *For a full documentation & usage guide, refer to the respective subsection.*
- *Features marked with the 🆕 emoji are new to version 2.0.*
- *Features marked with ✴️ been improved in version 2.0. Refer to the documentation to see what's new.*

### [Powerful Quick Switcher](documentation/Quick Switcher.md)
- ✴️ Search Notes
- Open Notes in new Pane, append to notes, copy link, …
- ✴️ Includes Aliases
- 🆕 Search Headings (included heading levels configurable)
- Search Starred Notes
- Search Recent Notes
- ✴️ Browse folders (move to parent folders, create notes in folders)
- 🆕 Search Notes via Tags
- 🆕 Browse a note's links (outgoing, backlinks, external)
- 🆕 Open External Links of a Note (without switching to the document or opening Obsidian)
- 🆕 Graph Traversal via Alfred
- ✴🆕 Smart Search: A query like `o foobar #moc starred` will only display files names "foobar" with the tag "#moc" that are also starred.

### [Utility Features](documentation/Utility Features.md)
- [OCR Screenshots](documentation/Utility Features.md#OCR Screenshots)
- [🆕 Paste URL into selection](documentation/Utility Features.md#Paste URL into selection)
- [🆕 Move Note to a different folder](documentation/Utility Features.md#Move Note)
- [Create a new Note](documentation/Utility Features.md#Create new Note)
- [Backup your Vault](documentation/Utility Features.md#Backup your Vault)
- [Dual Mode (Edit + Preview)](documentation/Utility Features.md#Dual Mode)
- [Conveniently access various folders like `.obsidian` or `.trash`](documentation/Utility Features.md#Open Various Folders)
- [✴️ Multi-Vault-Support: Switch the Vault controlled by this workflow](documentation/Utility Features.md#Change & Access your Vault)
- [🆕 Daily Notes](documentation/Utility Features.md#Daily Notes)
- [Carl 🐢](documentation/Utility Features.md#Carl 🐢)

### [Plugin & Theme Search](documentation/Plugin & Theme Search.md)
- Create new Notes (based on Template or via QuickAdd)
- Search Community Plugins and Themes
- Open in Obsidian or GitHub
- 🆕 Access Plugin Settings
- 🆕 Search & Create GitHub Issues
- 🆕 *No annoyed developers! When the installed version is out of date, issue creation is blocked and replaced by a shortcut to update the plugin instead*

### [Workspace Switcher](documentation/Workspace Switcher.md)
- ✴️ Quickly switch Workspaces
- 🆕 Manage Workspaces
- 🆕 Automatically toggle Spellchecking when switching to certain workspaces

### [Documentation Search](documentation/Documentation Search.md)
- Search the Official Obsidian Documentation
- 🆕 Simultaneously search the Obsidian Hub
- Search the Forum

### [CSS-related Features](documentation/CSS-related Features.md)
- Access themes & CSS Snippets via Alfred
- Create new Snippets from Clipboard content
- 🆕 Quick Access to cheat sheets for theme development, e.g. default variables
- 🆕 Download a theme's CSS file via Theme Search
- Convert a font file base64-encoded CSS

### [Features for Developers](documentation/⚙️ Features for Developers.md)
- 🆕 Quick Access to cheat sheets for Plugin Development, e.g. Obsidian API
- ✴️ Quickly open various development-related folders
- 🆕 Clone a plugin's repository via the Plugin Search
- 🆕 Open the Vault's root in the default Terminal or in Finder
- 🆕 Add & Update Beta Plugins via BRAT

---

## [Installation](documentation/Installation.md)
- Requirements
- Installation
- Troubleshooting

## [Workflow Configuration](documentation/Workflow Configuration.md)
- Workflow Settings
- Setting up Hotkeys
- Metadata Extractor Configuration

## Credits
- Big shout-out to @koala for developing the [metadata extractor plugin](https://github.com/kometenstaub/metadata-extractor), for which this workflow is right now the main client.
- Also thanks to [@Vincent03](https://github.com/Vinzent03) for his invaluable [Advanced URI plugin](https://github.com/Vinzent03/obsidian-advanced-uri), which enables Alfred to control various aspects of Obsidian.
- Main icon by [Jack Liu](https://www.reddit.com/user/jackliu1219), with some additional icons from [Freepik](https://www.freepik.com/).
---
- This workflow has been created by @pseudometa#9546 ([Discord](https://discord.gg/veuWUTm)) aka [@pseudo_meta (Twitter)](https://twitter.com/pseudo_meta), aka Chris Grieser (rl).
- Donate [via PayPal](https://www.paypal.com/paypalme/ChrisGrieser).
- In my day job, I am a PhD student in sociology, investigating the governance of the app economy. If you are interested in this subject, feel free to visit [my academic homepage](https://chris-grieser.de/) and get in touch!
