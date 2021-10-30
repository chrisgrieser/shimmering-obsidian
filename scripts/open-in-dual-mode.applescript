#!/usr/bin/env osascript

if application "Obsidian" is not running then
	tell application "Obsidian" to activate
	delay 1.2
end if

tell application "Obsidian" to open location "obsidian://advanced-uri?commandid=workspace%253Asplit-vertical"
delay 0.1

-- toggle view mode, if current != default view mode
if ((system attribute "switchView") is "switch-necessary")
	delay 0.3
	tell application "Obsidian" to open location "obsidian://advanced-uri?commandid=markdown%253Atoggle-preview"
end if

