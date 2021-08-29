#!/usr/bin/env osascript

if application "Obsidian" is not running then
	tell application "Obsidian" to activate
	delay 1.2
end if

tell application "Obsidian"
	open location "obsidian://advanced-uri?commandid=workspace%253Acopy-path"
	delay 0.1 -- Short pause, to make sure the path has been copied to the clipboard
	open location "obsidian://advanced-uri?commandid=switcher%253Aopen"
end tell

delay 0.1

-- workaround to open in new pane
-- see https://forum.obsidian.md/t/open-a-note-in-a-new-pane-using-the-command-palette-or-a-keyboard-shortcut/23303
tell application "System Events"
	tell process "Obsidian"
		set frontmost to true
		click menu item "Paste" of menu "Edit" of menu bar 1
	end tell
	delay 0.1
	keystroke return using {command down}
end tell

delay 0.3
-- toggle view mode
tell application "Obsidian" to open location "obsidian://advanced-uri?commandid=markdown%253Atoggle-preview"