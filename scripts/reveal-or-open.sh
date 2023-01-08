#!/bin/zsh
relPath="$*"
vault_path="$(cat ./vaultPath)" && vault_path="${vault_path/#\~/$HOME}"
filePath="$vault_path/$relPath"

if [[ $(file --brief "$filePath") == directory ]] ; then
	open "$filePath"
else
	open -R "$filePath"
fi

echo -n "$relPath"
