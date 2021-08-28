#!/usr/bin/env osascript -l JavaScript
Obsidian = Application("/Applications/Obsidian.app");
Obsidian.includeStandardAdditions = true;
const homepath = Obsidian.pathTo('home folder');

// get vault-relative file path
Obsidian.openLocation("obsidian://advanced-uri?commandid=workspace%253Acopy-path");

// Short pause, to make sure the path has been copied to the clipboard
delay (0.1)
Obsidian.openLocation ("obsidian://advanced-uri?commandid=switcher%253Aopen");
