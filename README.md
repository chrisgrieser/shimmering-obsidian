# Shimmering Obsidian 🎩
*An Alfred Workflow with dozens of features for [Obsidian](https://obsidian.md/)*.

> **Note**  
> [Version 2.27](https://github.com/chrisgrieser/shimmering-obsidian/releases/tag/2.27.7) is the last version compatible with Alfred 4. All future versions of this workflow will require Alfred 5.

![](https://img.shields.io/github/downloads/chrisgrieser/shimmering-obsidian/total?label=Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/shimmering-obsidian?label=Latest%20Release&style=plastic) [![](https://img.shields.io/badge/changelog-click%20here-FFE800?style=plastic)](Changelog.md)

<img src="https://user-images.githubusercontent.com/73286100/139678407-9ac39baa-5f49-42a0-9622-0fbaf68540b2.gif" alt="Promo Video" width=70%>

---

- [Installation](#Workflow-Installation)
- [Troubleshooting](docs/Troubleshooting.md)
- [Changelog](Changelog.md)
- [Credits & Donations](#Credits--Thanks)
- [About the Developer](#about-the-developer)

---

## Feature Overview
*For a full documentation & usage guide, follow the links to the respective subsection.*

### Powerful Alfred-based Quick Switcher
- Search for Notes
	- Includes Aliases
	- Search Headings (included heading levels configurable)
	- Search Starred Notes
	- Search Recent Notes
- Browse Folders (move to parent folders, create notes in folders)
- Search Notes via Tags
- Browse a note's links (outgoing, backlinks, external)
- Open External Links of a Note (without switching to the document or opening Obsidian)
- Graph Traversal via Alfred
- Smart Search: A query like `o foobar #moc starred` displays only files named "foobar" with the tag "#moc" that are also starred.
- Visual Search: Add Icons to your tags based on their tags, similar to the [Supercharged Links](https://obsidian.md/plugins?id=supercharged-links-obsidian) Plugin.
- …

➡️ [Documentation of Quick Switcher Features](docs/Alfred-based%20Quick%20Switcher.md)

---

### Note-related Features
- Create new Notes (based on Template or via QuickAdd)
- Quickly append to a scratchpad note

➡️ [Documentation of Note-related Features](docs/Note-related%20Features.md)

---

### Screenshot Features
- OCR Screenshots
- Image Screenshot
- Both work for screenshots taken in quick succession, e.g. during a live presentation or lecture.

➡️ [Documentation of Screenshot Features](docs/Screenshot%20Features.md)

---

### Utility Features
- Backup your Vault
- Access various folders like `.obsidian` or `.trash`
- Update Plugins (including Beta Plugins installed via BRAT)

➡️ [Documentation of all Utility Features](docs/Utility%20Features.md)

---

### Plugin & Theme Search
- Search Community Plugins and Themes
- Open in Obsidian or GitHub
- Access Plugin Settings
- Search & Create GitHub Issues

➡️ [Documentation of the Plugin & Theme Search](docs/Plugin%20and%20Theme%20Search.md)

---

### Workspace Switcher
- Quickly switch (load) workspaces
- works with via Switcher Modal or Hotkeys
- Save Workspaces
- Manage Workspaces
- Automatically toggle spellchecking when switching to certain workspaces

➡️ [Documentation of the Workspace Switcher](docs/Workspace%20Switcher.md)

---

### Settings & Local Plugin Search
- Search & quickly open specific Settings Tabs, the Theme Browser, or the Community Browser
- Quickly update all plugins
- Open Plugin Settings
- Open local plugin folders in `.obsidian/plugins/`
- Enable/Disable plugins

➡️ [Documentation of the Settings Search](docs/Settings%20and%20Local%20Plugin%20Search.md)

---

### Documentation Search
- Search the [Official Obsidian Documentation](https://help.obsidian.md/Obsidian/Index)
- Simultaneously search the [Obsidian Hub](https://publish.obsidian.md/hub/00+-+Start+here)
- Search the [Obsidian Forum](https://forum.obsidian.md/)
- Browse Forum Categories

➡️ [Documentation of the Documentation & Forum Search](docs/Documentation%20and%20Forum%20Search.md)

---

### Vault Switcher
- Switch the Vault controlled by this Alfred workflow.
- Open vaults in Obsidian, Finder, or the Terminal.

➡️ [Documentation of the Vault Switcher](docs/Vault%20Switcher.md)

---

### CSS-related Features
- Quickly access themes & CSS Snippets
- Create new snippets from the clipboard

➡️ [Documentation of CSS-related Features](docs/CSS-related%20Features.md)

---

### Features for Developers
- Quickly open various development-related folders
- Open a local plugin's folder in Finder or the Terminal
- Quick Copy of a plugin's ID
- Open the Vault's root in the default Terminal or in Finder
- Add & Update Beta Plugins via [BRAT](https://github.com/TfTHacker/obsidian42-brat)
- Search the [inofficial plugin docs](https://marcus.se.net/obsidian-plugin-docs/)

➡️ [Documentation of Features for Developers](docs/Features%20for%20Developers.md)

---

## Workflow Installation
*This workflow requires the [Powerpack for Alfred](https://www.alfredapp.com/powerpack/). Furthermore, version 3+ of this workflow requires Alfred 5, workflow version 2.27 being the last version supporting Alfred 4.*
1. Install the Obsidian plugins [Advanced URI](https://obsidian.md/plugins?id=obsidian-advanced-uri) & [Metadata Extractor](https://obsidian.md/plugins?id=metadata-extractor). Enable both plugins.
2. Download the [latest release at GitHub](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest). Double-click the `.alfredworkflow` file to install it.
3. Run the Alfred Command `osetup` and select the vault you want to control with *Shimmering Obsidian*. Obsidian will then restart. (Even if you have only one vault, you need to confirm that one vault once before you can use the workflow.)

## Configuration
There are extensive settings to configure everything to your hearts content. 

![workflow settings](docs/images/workflow-settings.gif)

## Alfred Themes
I also designed some [themes for Alfred](https://github.com/chrisgrieser/alfred-themes) you can check out.

## Credits & Thanks
- Big shout-out to @koala for developing the [metadata extractor plugin](https://github.com/kometenstaub/metadata-extractor), for which this workflow is right now the main client.
- Also thanks to [@Vinzent03](https://github.com/Vinzent03) for his invaluable [Advanced URI plugin](https://github.com/Vinzent03/obsidian-advanced-uri), which enables Alfred to control various aspects of Obsidian.
- Main icon by [Jack Liu](https://www.reddit.com/user/jackliu1219).
- <a href="https://www.flaticon.com/authors/freepik">Other icons created by Freepik - Flaticon</a>

## About the Developer
In my day job, I am a sociologist studying the social mechanisms underlying the digital economy. For my PhD project, I investigate the governance of the app economy and how software ecosystems manage the tension between innovation and compatibility. If you are interested in this subject, feel free to get in touch!

<!-- markdown-link-check-disable -->

### Profiles
- [Academic Website](https://chris-grieser.de/)
- [ResearchGate](https://www.researchgate.net/profile/Christopher-Grieser)
- [Discord](https://discordapp.com/users/462774483044794368/)
- [GitHub](https://github.com/chrisgrieser/)
- [Twitter](https://twitter.com/pseudo_meta)
- [LinkedIn](https://www.linkedin.com/in/christopher-grieser-ba693b17a/)

*Note that for questions, bug reports, or feature requests for this workflow, it's better if you open an [GitHub issue](https://github.com/chrisgrieser/shimmering-obsidian/issues), since it is better suited for technical support.*

### Donate
<a href='https://ko-fi.com/Y8Y86SQ91' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---

[⬆️ Go Back to Top](#Feature-Overview)
