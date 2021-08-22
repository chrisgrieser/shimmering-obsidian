#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib');
Obsidian = Application("/Applications/Obsidian.app");
Obsidian.includeStandardAdditions = true;
const homepath = Obsidian.pathTo('home folder');

//get vault path
var vault_path = $.getenv('vault_path');
vault_path = vault_path.replace(/^~/, homepath);

// get vault-relative file path
Obsidian.openLocation("obsidian://advanced-uri?commandid=workspace%253Acopy-path");

// Short pause, to make sure the path has been copied to the clipboard
delay (0.1)
var currentNote = vault_path + "/" + Obsidian.theClipboard();

// open new pane
// (unfortunately only possible by creating a new note...)
Obsidian.openLocation("obsidian://advanced-uri?vault=Vault&commandid=file-explorer%253Anew-file-in-new-pane");
delay (0.2)
Obsidian.openLocation("obsidian://advanced-uri?vault=Vault&commandid=app%253Adelete-file");
delay (0.1)

//open current note
Obsidian.openLocation("obsidian://open?path=" + encodeURIComponent(currentNote) );
delay (0.1)

// toggle preview/edit for new pane
Obsidian.openLocation("obsidian://advanced-uri?vault=Vault&commandid=markdown%253Atoggle-preview");
