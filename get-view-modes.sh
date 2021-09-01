#!/bin/zsh

vault_path="${vault_path/#\~/$HOME}"
default_view=`grep "defaultViewMode" "$vault_path""/.obsidian/app.json" | cut -d '"' -f 4`
current_view=`grep "mode" "$vault_path""/.obsidian/workspace" | head -n 1 | cut -d '"' -f 4`

if [[ "$current_view" == "$default_view" ]] ; then
   echo -n "switch-necessary"
else
   echo -n "no-switch"
fi