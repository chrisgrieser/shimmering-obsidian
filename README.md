# Shimmering Obsidian 🎩
Alfred workflow with dozens of features for controlling your
[Obsidian](https://obsidian.md/) vault.

[⭐Featured in the Alfred Gallery.](https://alfred.app/workflows/chrisgrieser/shimmering-obsidian/)

![Download count](https://img.shields.io/github/downloads/chrisgrieser/shimmering-obsidian/total?label=Downloads&style=plastic)
![Last release](https://img.shields.io/github/v/release/chrisgrieser/shimmering-obsidian?label=Latest%20Release&style=plastic)

<img alt="Promo Video" width=70% src="https://user-images.githubusercontent.com/73286100/139678407-9ac39baa-5f49-42a0-9622-0fbaf68540b2.gif">

<!-- toc -->

- [Feature overview](#feature-overview)
	* [Powerful Alfred-based quick switcher](#powerful-alfred-based-quick-switcher)
	* [Note-related features](#note-related-features)
	* [Screenshot features](#screenshot-features)
	* [Utility features](#utility-features)
	* [Plugins & themes](#plugins--themes)
	* [Workspace switcher](#workspace-switcher)
	* [Vault switcher](#vault-switcher)
	* [Settings & Local Plugins](#settings--local-plugins)
	* [Documentation & Help](#documentation--help)
	* [Features for Obsidian Plugin Developers](#features-for-obsidian-plugin-developers)
- [Cheatsheet](#cheatsheet)
- [Installation](#installation)
- [Credits](#credits)
- [About the Developer](#about-the-developer)

<!-- tocstop -->

## Feature overview
*F/theme a full documentation & usage guide, follow the links to the respective subsection.*

### Powerful Alfred-based quick switcher
- Search for notes
	* Includes aliases
	* Search headings
	* Search bookmarked notes
	* Search recent notes
- Browse folders (move to parent folders, create notes in folders)
- Search notes via tags
- Browse a note's links (outgoing, backlinks, external)
- Open External Links of a note (without switching to the document or opening Obsidian)
- Search only for attachments (non-markdown files) in your vault
- Graph Traversal via Alfred
- Smart Search: A query like `o foobar #moc starred` displays only files named
  "foobar" with the tag `#moc` that are also starred.
- Visual Search: Add Icons to your notes based on their tags, similar to the
  [Supercharged
  Links](https://obsidian.md/plugins?id=supercharged-links-obsidian) Plugin.
- ➡️ [Documentation of Quick Switcher features](docs/Alfred-based%20Quick%20Switcher.md)

### Note-related features
- Create new Notes, based on a template
- Quickly append to a scratchpad note
- 🆕 Search all external links in the vault
- ➡️ [Documentation of Note-related Features](docs/Note-related%20Features.md)

### Screenshot features
- OCR-Screenshots
- Image Screenshot
- Both work for screenshots taken in quick succession, for example during a live
  presentation or lecture.
- ➡️ [Documentation of Screenshot Features](docs/Screenshot%20Features.md)

### Utility features
- Back up your vault
- Access various folders like `.obsidian` or `.trash`
- Update plugins
- Open CSS snippets
- ➡️ [Documentation of all Utility Features](docs/Utility%20Features.md)

### Plugins & themes
- Search Community Plugins and Themes, open in Obsidian or at GitHub
- Access Plugin Settings
- ➡️ [Documentation of the Plugin & Theme Search](docs/Plugin%20and%20Theme%20Search.md)

### Workspace switcher
- Switch & save workspaces
- ➡️ [Documentation of the Workspace Switcher](docs/Workspace%20Switcher.md)

### Vault switcher
- Open vaults in Obsidian, Finder, or the Terminal.
- ➡️ [Documentation of the Vault Switcher](docs/Vault%20Switcher.md)

### Settings & Local Plugins
- Search & open specific settings tabs
- Open plugin settings
- Open local plugin folders in `.obsidian/plugins/`
- Enable or disable plugins
- ➡️ [Documentation of the Settings Search](docs/Settings%20and%20Local%20Plugin%20Search.md)

### Documentation & Help
- Search the [Official Obsidian Documentation](https://help.obsidian.md/Home)
  and the [Obsidian Hub](https://publish.obsidian.md/hub/00+-+Start+here)
- Search the [dataview documentation](https://blacksmithgu.github.io/obsidian-dataview/).
- ➡️ [Documentation of the Documentation Search](docs/Documentation%20Search.md)

### Features for Obsidian Plugin Developers
- Search the [official developer docs](https://docs.obsidian.md/Home)
- Open various development-related folders
- Open a local plugin's folder in Finder or the Terminal
- Copy plugin IDs
- ➡️ [Documentation of Features for Developers](docs/Features%20for%20Developers.md)

## Cheatsheet
Search
- `o`: All notes
- `oe`: All external links
- `ot`: Tags
- `ob`: Bookmarked files/searches
- `or`: Recent files
- `oa`: attachments (such as images)

Note Features
- `oo`: Append to scratchpad
- `oo`: Open to scratchpad
- `on`: New note

Workspace
- `ow`: Workspace switcher
- `ov`: Vault switcher

Miscellaneous
- `oh`: Documentation search
- `op`: Search plugins/themes
- `o,:` Search settings and installed plugins
- `ocss`: Open CSS snippets
- `oupdate`: Refreshing metadata, re-index, plugin update

## Installation
*This workflow requires Alfred 5 with [Powerpack](https://www.alfredapp.com/powerpack/).*
1. Install the Obsidian plugins [Advanced
   URI](https://obsidian.md/plugins?id=obsidian-advanced-uri) & [Metadata
   Extractor](https://obsidian.md/plugins?id=metadata-extractor). Enable both
   plugins.
2. Download the [latest release at
   GitHub](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest).
   Double-click the `.alfredworkflow` file to install it.
3. Set your vault path in the workflow configuration.
4. Run the Alfred Command `osetup`. Obsidian then restarts.

## Credits
- Big shout-out to [@kometenstaub](https://github.com/kometenstaub) for
  developing the [metadata extractor
  plugin](https://github.com/kometenstaub/metadata-extractor), as this workflow
  is its main client.
- Also thanks to [@Vinzent03](https://github.com/Vinzent03) for his invaluable
  [Advanced URI plugin](https://github.com/Vinzent03/obsidian-advanced-uri),
  which enables Alfred to control various aspects of Obsidian.
- Most icons created by [Freepik (Flaticon)](https://www.flaticon.com/authors/freepik).

<!-- vale Google.FirstPerson = NO -->
## About the Developer
In my day job, I am a sociologist studying the social mechanisms underlying the
digital economy. For my PhD project, I investigate the governance of the app
economy and how software ecosystems manage the tension between innovation and
compatibility. If you are interested in this subject, feel free to get in touch.

- [Academic Website](https://chris-grieser.de/)
- [ResearchGate](https://www.researchgate.net/profile/Christopher-Grieser)
- [Discord](https://discordapp.com/users/462774483044794368/)
- [Mastodon](https://pkm.social/@pseudometa)
- [LinkedIn](https://www.linkedin.com/in/christopher-grieser-ba693b17a/)

*Note that for questions, bug reports, or feature requests for this workflow,
please open a [GitHub
issue](https://github.com/chrisgrieser/shimmering-obsidian/issues), since it is
better suited for technical support.*

<a href='https://ko-fi.com/Y8Y86SQ91' target='_blank'><img height='36'
style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3'
border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---

[⬆️ Go Back to Top](#feature-overview)
