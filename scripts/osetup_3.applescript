#!/usr/bin/env osascript

# restart Obsidian
tell application "Obsidian" to if it is running then quit
delay 1
repeat until application "Obsidian" is not running
	delay 0.5
end repeat
delay 3

# dump metadata
set vaultName to (system attribute "vault_name_ENC")
set prefix to "obsidian://advanced-uri?vault=" & vaultName & "&commandid=metadata-extractor%253A"
tell application "Obsidian"
	activate
	delay 1
	open location (prefix & "write-metadata-json")
	delay 0.5
	open location (prefix & "write-tags-json")
	delay 0.5
	open location (prefix & "write-allExceptMd-json")
	delay 0.5
	open location (prefix & "write-canvas-json")
end tell
