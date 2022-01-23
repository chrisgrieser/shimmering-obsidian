#!/bin/zsh

ObsidianVersion="$(ls ~"/Library/Application Support/obsidian/"*".asar" | egrep -o "\d+\.\d+\.\d+\.asar" | sed "s/\.asar//")"
MacVersion="$(sw_vers -productVersion)"
echo -n "macOS $MacVersion\nObsidian $ObsidianVersion"
