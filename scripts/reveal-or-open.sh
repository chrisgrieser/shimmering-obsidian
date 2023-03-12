#!/bin/zsh
relPath="$*"
vault_path="$(cat ./vaultPath)" && vault_path="${vault_path/#\~/$HOME}"
absPath="$vault_path/$relPath"

if [[ -d "$absPath" ]] ; then
	open "$absPath"
elif [[ -f "$absPath" ]] ; then
	open -R "$absPath"
fi
