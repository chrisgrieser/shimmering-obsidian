# Shimmering Obsidian 🎩
Alfred Workflow with dozens of features for controlling your [Obsidian vault](https://obsidian.md/).

[Featured in the Alfred Gallery.](https://alfred.app/workflows/chrisgrieser/shimmering-obsidian/)

![](https://img.shields.io/github/downloads/chrisgrieser/shimmering-obsidian/total?label=Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/shimmering-obsidian?label=Latest%20Release&style=plastic) 

<img src="https://user-images.githubusercontent.com/73286100/139678407-9ac39baa-5f49-42a0-9622-0fbaf68540b2.gif" alt="Promo Video" width=70%>

---

<!--toc:start-->
- [Feature Overview](#feature-overview)
    - [Powerful Alfred-based Quick Switcher](#powerful-alfred-based-quick-switcher)
    - [Note-related Features](#note-related-features)
    - [Screenshot Features](#screenshot-features)
    - [Utility Features](#utility-features)
    - [Plugins & Themes](#plugins-themes)
    - [Workspace Switcher](#workspace-switcher)
    - [Settings & Local Plugins](#settings-local-plugins)
    - [Documentation & Help](#documentation-help)
    - [Vault Switcher](#vault-switcher)
    - [Features for Obsidian Plugin Developers](#features-for-obsidian-plugin-developers)
- [Installation](#installation)
- [Credits](#credits)
- [About the Developer](#about-the-developer)
<!--toc:end-->


## Feature Overview
*For a full documentation & usage guide, follow the links to the respective subsection.*

### Powerful Alfred-based Quick Switcher
- Search for Notes
	- Includes Aliases
	- Search Headings
	- Search Bookmarked Notes
	- Search Recent Notes
- Browse Folders (move to parent folders, create notes in folders)
- Search Notes via Tags
- Browse a note's links (outgoing, backlinks, external)
- Open External Links of a Note (without switching to the document or opening Obsidian)
- Search only for attachments (non-markdown files) in your vault
- Graph Traversal via Alfred
- Smart Search: A query like `o foobar #moc starred` displays only files named "foobar" with the tag `#moc` that are also starred.
- Visual Search: Add Icons to your tags based on their tags, similar to the [Supercharged Links](https://obsidian.md/plugins?id=supercharged-links-obsidian) Plugin.
- ➡️ [Documentation of Quick Switcher Features](docs/Alfred-based%20Quick%20Switcher.md)

### Note-related Features
- Create new Notes, based on a template
- Quickly append to a scratchpad note
- Search all external links in the vault
- ➡️ [Documentation of Note-related Features](docs/Note-related%20Features.md)

### Screenshot Features
- OCR-Screenshots
- Image Screenshot
- Both work for screenshots taken in quick succession, for example during a live presentation or lecture.
- ➡️ [Documentation of Screenshot Features](docs/Screenshot%20Features.md)

### Utility Features
- Back up your Vault
- Access various folders like `.obsidian` or `.trash`
- Update Plugins (including Beta Plugins installed via `BRAT`)
- Open CSS Snippets
- ➡️ [Documentation of all Utility Features](docs/Utility%20Features.md)

### Plugins & Themes
- Search Community Plugins and Themes, open in Obsidian or at GitHub
- Access Plugin Settings
- Search & Create GitHub Issues
- ➡️ [Documentation of the Plugin & Theme Search](docs/Plugin%20and%20Theme%20Search.md)

### Workspace Switcher
- Switch & Save workspaces
- Manage Workspaces
- Automatically toggle spellchecking when switching to certain workspaces
- ➡️ [Documentation of the Workspace Switcher](docs/Workspace%20Switcher.md)

### Settings & Local Plugins
- Search & open specific Settings Tabs
- Open Plugin Settings
- Open local plugin folders in `.obsidian/plugins/`
- Enable or disable plugins
- ➡️ [Documentation of the Settings Search](docs/Settings%20and%20Local%20Plugin%20Search.md)

### Documentation & Help
- Search the [Official Obsidian Documentation](https://help.obsidian.md/Home) and the [Obsidian Hub](https://publish.obsidian.md/hub/00+-+Start+here)
- ➡️ [Documentation of the Documentation Search](docs/Documentation%20Search.md)

### Vault Switcher
- Switch the Vault controlled by this Alfred workflow.
- Open vaults in Obsidian, Finder, or the Terminal.
- ➡️ [Documentation of the Vault Switcher](docs/Vault%20Switcher.md)

### Features for Obsidian Plugin Developers
- Search the [official developer docs](https://docs.obsidian.md/Home)
- Open various development-related folders
- Open a local plugin's folder in Finder or the Terminal
- Copy plugin IDs
- Open the Vault's root in the default Terminal or in Finder
- Add & Update Beta Plugins via [BRAT](https://github.com/TfTHacker/obsidian42-brat)
- ➡️ [Documentation of Features for Developers](docs/Features%20for%20Developers.md)

## Installation
*This workflow requires the Alfred 5 with [Powerpack](https://www.alfredapp.com/powerpack/).*
1. Install the Obsidian plugins [Advanced URI](https://obsidian.md/plugins?id=obsidian-advanced-uri) & [Metadata Extractor](https://obsidian.md/plugins?id=metadata-extractor). Enable both plugins.
2. Verify you have not renamed your Obsidian config folder, meaning it is still `.obsidian` (Settings → About → Advanced → Override config folder).
3. Download the [latest release at GitHub](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest). Double-click the `.alfredworkflow` file to install it.
4. Run the Alfred Command `osetup` and select the vault you want to control with *Shimmering Obsidian*. Obsidian then restarts. (Even if you have only one vault, you need to confirm that one vault once before you can use the workflow.)

## Credits
- Big shout-out to [@kometenstaub](https://github.com/kometenstaub) for developing the [metadata extractor plugin](https://github.com/kometenstaub/metadata-extractor), as this workflow is its main client.
- Also thanks to [@Vinzent03](https://github.com/Vinzent03) for his invaluable [Advanced URI plugin](https://github.com/Vinzent03/obsidian-advanced-uri), which enables Alfred to control various aspects of Obsidian.
- <a href="https://www.flaticon.com/authors/freepik">Most icons created by Freepik (Flaticon)</a>

<!-- vale Google.FirstPerson = NO -->
## About the Developer
In my day job, I am a sociologist studying the social mechanisms underlying the digital economy. For my PhD project, I investigate the governance of the app economy and how software ecosystems manage the tension between innovation and compatibility. If you are interested in this subject, feel free to get in touch.

__Profiles__  
- [Academic Website](https://chris-grieser.de/)
- [ResearchGate](https://www.researchgate.net/profile/Christopher-Grieser)
- [Discord](https://discordapp.com/users/462774483044794368/)
- [GitHub](https://github.com/chrisgrieser/)
- [Twitter](https://twitter.com/pseudo_meta)
- [Mastodon](https://pkm.social/@pseudometa)
- [LinkedIn](https://www.linkedin.com/in/christopher-grieser-ba693b17a/)

*Note that for questions, bug reports, or feature requests for this workflow, please open a [GitHub issue](https://github.com/chrisgrieser/shimmering-obsidian/issues), since it is better suited for technical support.*

__Donate__  
<br>
<a href='https://ko-fi.com/Y8Y86SQ91' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---

[⬆️ Go Back to Top](#Feature-Overview)
