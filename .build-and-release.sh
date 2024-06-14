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
	exit 1
fi

# update version number in THE REPO'S `info.plist`
plutil -replace version -string "$nextVersion" info.plist

#───────────────────────────────────────────────────────────────────────────────
# INFO
# this section assumes the local folder is named the same as the github repo

# update version number in LOCAL `info.plist`
prefs_location=$(grep "current" "$HOME/Library/Application Support/Alfred/prefs.json" | cut -d'"' -f4 | sed -e 's|\\/|/|g' -e "s|^~|$HOME|")
workflow_name="$(basename "$PWD")"
localInfoPlist="$prefs_location/workflows/$workflow_name/info.plist"
[[ -f "$localInfoPlist" ]] && plutil -replace version -string "$nextVersion" "$localInfoPlist"

# convenience: copy download link for current version
github_username="chrisgrieser"
echo -n "https://github.com/$github_username/$workflow_name/releases/download/$nextVersion/${workflow_name}.alfredworkflow" |
	pbcopy

#───────────────────────────────────────────────────────────────────────────────
# commit and push
# (pushing a tag triggers the github release action)

git add --all &&
	git commit -m "release: $nextVersion" &&
	git pull &&
	git push &&
	git tag "$nextVersion" &&
	git push origin --tags
