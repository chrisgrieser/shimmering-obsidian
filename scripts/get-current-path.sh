#!/bin/zsh
open -a "Obsidian" "obsidian://advanced-uri?commandid=workspace%253Acopy-path"
sleep 0.15
echo -n "$(pbpaste)"
