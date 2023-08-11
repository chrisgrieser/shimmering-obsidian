#!/bin/zsh
relPath="$*"
# shellcheck disable=2154
absPath="$vault_path/$relPath"

if [[ -d "$absPath" ]] ; then
	open "$absPath"
elif [[ -f "$absPath" ]] ; then
	open -R "$absPath"
fi
