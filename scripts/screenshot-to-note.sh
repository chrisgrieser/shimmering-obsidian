#!/bin/zsh
vault_path="$(cat ./vaultPath)" && vault_path="${vault_path/#\~/$HOME}"

if [[ "$screenshot_path" == "" ]] ; then
	screenshot_path="$vaultPath/screenshots"
else
	screenshot_path="${screenshot_path/#\~/$HOME}"
fi

imageNote="$vault_path/Images.md"
imageFileName="Screenshot $(date '+%Y-%m-%d %H-%M-%S').png"
imagePath="$screenshot_path/$imageFileName"

mkdir -p "$screenshot_path"
screencapture -i "$imagePath"
echo "![[$imageFileName]]" >> "$imageNote"

if [[ -e "$imagePath" ]] ; then
	echo "Screenshot made"
fi
