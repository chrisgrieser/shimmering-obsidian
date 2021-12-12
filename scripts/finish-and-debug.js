#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
Application("com.runningwithcrayons.Alfred").removeConfiguration(
	"ObRunning",
	{ inWorkflow: $.getenv("alfred_workflow_bundleid") }
);

console.log("Alfred version: " + $.getenv("alfred_version"));
console.log("Workflow version: " + $.getenv("alfred_workflow_version"));
