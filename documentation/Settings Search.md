[⏪ Go back to the Feature Overview](../README.md#feature-overview)

<img src="https://user-images.githubusercontent.com/73286100/142665796-c588ec37-97b2-446a-841c-e19a92ecaa22.gif" alt="Screen Recording 2021-11-19 at 18 21 21" width=60%>

# Settings Search
*version 2.1*

**`o,`: Search and directly open specific setting tabs.[^1]**
- The search includes Obsidian main settings, quick access to the plugin and theme browser, as well as settings for plugins. Press `↵` to open the respective setting *directly*.
- The search smartly matches also the content of the respective settings tabs, e.g. the query `o, readable line` will show the Editor Settings, since the "Readable line length" option can be found there.
- `⌥ + ↵` will open the local plugin folder in `.obsidian/plugins/` in Finder.
- _⚙️ For developers:_
	- `⌘ + ↵` will open browse the local plugin folder in your default Terminal.[^2]
	- `⌃ + ↵` copies the plugin's id. (Hold `⌃` to see the plugin's id.)
	- `fn + ↵` runs `git pull` in the plugin's directory.

## Tips
- 💡 `o,` refers to the `⌘ ,` shortcut used to open the settings.
- For other plugin-related features, see also the [Plugin & Theme Search](Plugin%20and%20Theme%20Search.md).

[^1]: Thanks to @Vinzent03 for enabling this feature.
[^2]: You can [change the default terminal in the Alfred Settings](https://www.alfredapp.com/help/features/terminal/).
