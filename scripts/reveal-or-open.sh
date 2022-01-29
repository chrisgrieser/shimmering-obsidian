#!/bin/zsh
relPath="$*"
filePath="${vault_path/#\~/$HOME}"/"$relPath"

if [[ $(file --brief "$filePath") == directory ]] ; then
	open "$filePath"
else
	open -R "$filePath"
fi

echo -n "$relPath"
