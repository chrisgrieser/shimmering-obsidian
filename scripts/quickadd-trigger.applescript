#!/usr/bin/env osascript

if application "Obsidian" is not running then delay 1.2

tell application "Obsidian"
	activate
	open location "obsidian://advanced-uri?commandid=quickadd%253ArunQuickAdd"
end tell

set parameter to do shell script "echo " & quoted form of (system attribute "parameter") & " | iconv -f UTF-8-MAC -t MACROMAN"

if (parameter is not "") then
	delay 0.2
	tell application "Obsidian" to activate
	tell application "System Events" to keystroke parameter
end if