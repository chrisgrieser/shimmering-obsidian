#!/usr/bin/env osascript
tell application "Obsidian" to if it is running then quit
delay 0.2
repeat until application "Obsidian" is not running
	delay 0.2
end repeat
delay 1

# dump metadata
tell application "Obsidian"
	activate
	open location "obsidian://advanced-uri?commandid=metadata-extractor%253Awrite-metadata-json"
	open location "obsidian://advanced-uri?commandid=metadata-extractor%253Awrite-tags-json"
	open location "obsidian://advanced-uri?commandid=metadata-extractor%253Awrite-allExceptMd-json"
end tell
