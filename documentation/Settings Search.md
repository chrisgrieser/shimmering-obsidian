[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Settings Search
*🆕 version 2.1*

**`o,`: Search and directly open specific setting tabs.**
- The search includes Obsidian main settings as well as settings for plugins.
- The search smartly matches also the content of the respective settings tabs, e.g. the query `o, readable line` will show the Editor Settings, since the "Readable line length" option can be found there.
- Press `↵`to open the respective setting *directly*.[^1]
- _⚙️ For developers:_ `⌘ + ↵` will open browse the local plugin folder in your default Terminal.[^2]
- `⌥ + ↵` will open the local plugin folder in `.obsidian/plugins/` in Finder.
- 💡 `o,` refers to the `⌘ + ,` shortcut used to open the settings.
- For other plugin-related features, see also the [Plugin & Theme Search](Plugin%20and%20Theme%20Search.md).

[^1]: Thanks to @Vinzent03 for enabling this feature.
[^2]: You can [change the default terminal in the Alfred Settings](https://www.alfredapp.com/help/features/terminal/).
