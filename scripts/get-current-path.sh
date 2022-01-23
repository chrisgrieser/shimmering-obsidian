#!/bin/zsh
open -a "Obsidian" "obsidian://advanced-uri?vault=${vault_name_ENC}&commandid=workspace%253Acopy-path"
sleep 0.2
echo -n "$(pbpaste)"

# append to log buffer
echo -n "[ol]             " >> "$alfred_workflow_data"/buffer_log
