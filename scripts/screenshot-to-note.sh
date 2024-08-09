#!/bin/zsh
# shellcheck disable=2154

[[ "$screenshot_path" == "" ]] && screenshot_path="$vault_path/screenshots"

mkdir -p "$screenshot_path"
imageFileName="Screenshot $(date '+%Y-%m-%d %H-%M-%S').png"
imagePath="$screenshot_path/$imageFileName"

screencapture -i "$imagePath"

if [[ -e "$imagePath" ]] ; then
    echo "![[$imageFileName]]" >> "$vault_path/Images.md"

    echo -n "Screenshot made"
fi