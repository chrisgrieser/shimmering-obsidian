# Vault Switcher

**`ov`: Open `V`aults in Obsidian, Finder, or the Terminal**
- Select a Vault and press `↵` to open it in Obsidian.
	- `⌘ + ↵` will open the root of the selected vault in your default Terminal. You can [change the default terminal in the Alfred Settings](https://www.alfredapp.com/help/features/terminal/).
	- `⌥ + ↵` open the root in Finder.
	- `⇧ + ↵` to control the selected vault with _Shimmering Obsidian_. (This Alfred workflow can only work on one vault at the same time.) The first time you are controlling another vault, you need to install [the requirements](../README.md#Workflow-Installation) and run `osetup` in that vault once. (Note: [Due to an upstream bug, there is sometimes an issue switching vaults](https://github.com/chrisgrieser/shimmering-obsidian/issues/101#issuecomment-1314442144))
	- _⚙️ For developers_: use `fn + ↵` to run `git pull`on the vault
- Open the Vault Menu to create new vaults or remove vaults.
