#!/usr/bin/env osascript


set vaultName to (system attribute "vault_name_ENC")

if application "Obsidian" is not running then
	tell application "Obsidian" to activate
	delay 1.2
end if

tell application "Obsidian" to open location "obsidian://advanced-uri?vault=" & vaultName & "&commandid=workspace%253Asplit-vertical"
delay 0.1

-- toggle view mode, if current != default view mode
if ((system attribute "switchView") is "switch-necessary")
	delay 0.3
	tell application "Obsidian" to open location "obsidian://advanced-uri?vault=" & vaultName & "&commandid=markdown%253Atoggle-preview"
end if

tell application id "com.runningwithcrayons.Alfred" to remove configuration "switchView" in workflow (system attribute "alfred_workflow_bundleid")

