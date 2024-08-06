#!/bin/zsh
#───────────────────────────────────────────────────────────────────────────────

# goto git root
cd "$(git rev-parse --show-toplevel)" || return 1

# Prompt for next version number
currentVersion=$(plutil -extract version xml1 -o - info.plist | sed -n 's/.*<string>\(.*\)<\/string>.*/\1/p')
echo "current version: $currentVersion"
echo -n "   next version: "
read -r nextVersion
echo "────────────────────────"

# GUARD
if [[ -z "$nextVersion" || "$nextVersion" == "$currentVersion" ]]; then
	print "\033[1;31mInvalid version number.\033[0m"
	return 1
fi

# update version number in THE REPO'S `info.plist`
plutil -replace version -string "$nextVersion" info.plist

#───────────────────────────────────────────────────────────────────────────────
# INFO this assumes the local folder is named the same as the github repo
# 1. update version number in LOCAL `info.plist`
# 2. convenience: copy download link for current version

# update version number in LOCAL `info.plist`
prefs_location=$(grep "current" "$HOME/Library/Application Support/Alfred/prefs.json" | cut -d'"' -f4 | sed -e 's|\\/|/|g' -e "s|^~|$HOME|")
workflow_name="$(basename "$PWD")"
local_info_plist="$prefs_location/workflows/$workflow_name/info.plist"
[[ -f "$local_info_plist" ]] && plutil -replace version -string "$nextVersion" "$local_info_plist"

# copy download link for current version
msg="Available in the Alfred Gallery in 1-2 days, or directly by downloading the latest release here:"
github_user=$(git remote --verbose | head -n1 | sed -E 's/.*github.com[:\](.*)\/.*/\1/')
url="https://github.com/$github_user/$workflow_name/releases/download/$nextVersion/${workflow_name}.alfredworkflow"
echo -n "$msg $url" | pbcopy

#───────────────────────────────────────────────────────────────────────────────

# commit and push
git add --all &&
	git commit -m "release: $nextVersion" &&
	git pull --no-progress &&
	git push --no-progress &&
	git tag "$nextVersion" && # pushing a tag triggers the github release action
	git push --no-progress origin --tags
