#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

// remove config
Application("com.runningwithcrayons.Alfred").removeConfiguration("ObRunning", { inWorkflow: $.getenv("alfred_workflow_bundleid") } );

// log Version info to debugging log
const logPath = app.pathTo("home folder") + "/Library/Application Support/obsidian/obsidian.log";
const obsiVersion = app.doShellScript("grep -Eo -m 1 \"version is [0-9.]+\" \"" + logPath + "\" | cut -c12-" || true);
const macVersion = app.doShellScript("sw_vers -productVersion");

console.log("-------------------------------");
console.log("Alfred version: " + $.getenv("alfred_version"));
console.log("Workflow version: " + $.getenv("alfred_workflow_version"));
console.log("Obsidian version: " + obsiVersion);
console.log("macOS version: " + macVersion);
