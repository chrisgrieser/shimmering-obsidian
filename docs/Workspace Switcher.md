[⏪ Go back to the Feature Overview](https://github.com/chrisgrieser/shimmering-obsidian/blob/main/README.md#feature-overview)

# Workspace Switcher
**`ow`: Switch to a different `w`orkspace**
- Displays a list of your workspaces. Select one to open the workspace.
- You can also manage your Workspaces from here, i.e., saving, loading & deleting a workspace.
- Using the [workflow configuration](Workflow%20Configuration.md#Miscellaneous) `workspace_to_spellcheck`, you can define one workspace as a "spellcheck workspace". This means every time you switch to that workspace via `ow`, Spellcheck will be turned on, and every time you switch to a *different* workspace, spellcheck will be turned off.
	- Using `ow`, you can also simply toggle Obsidian's built in spellcheck.
- Unsurprisingly, this workflow requires the [Workspaces Core Plugin](https://help.obsidian.md/Plugins/Workspaces) to be enabled.

<img src="https://user-images.githubusercontent.com/73286100/133615940-a56731e5-6b60-4d28-b877-7ea48d10225e.gif" alt="workspace" width=60%>

**Triggered via Hotkey: Quick Workspace Switcher**
- Use the [workflow configuration](Workflow%20Configuration.md) `Workspace 1`, `Workspace 2`, and `Workspace 3` to select hotkeys.
- The hotkeys will automatically switch to the workspace. Note that the current workspace is not saved and that the hotkeys only work in Obsidian itself.
