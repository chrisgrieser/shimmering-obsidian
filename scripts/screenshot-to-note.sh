#!/bin/zsh
# shellcheck disable=2154

[[ "$screenshot_path" == "" ]] && screenshot_path="$vault_path/screenshots"

mkdir -p "$screenshot_path"
imageFileName="Screenshot $(date '+%Y-%m-%d %H-%M-%S').png"

screencapture -i "$screenshot_path/$imageFileName"
echo "![[$imageFileName]]" >> "$vault_path/Images.md"

[[ -e "$imagePath" ]] && echo -n "Screenshot made"
