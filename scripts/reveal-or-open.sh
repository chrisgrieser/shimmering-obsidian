#!/bin/zsh
relPath="$*"
# shellcheck disable=2154
vault_path="$(cat "$alfred_workflow_data/vaultPath")" && vault_path="${vault_path/#\~/$HOME}"
absPath="$vault_path/$relPath"

if [[ -d "$absPath" ]] ; then
	open "$absPath"
elif [[ -f "$absPath" ]] ; then
	open -R "$absPath"
fi
