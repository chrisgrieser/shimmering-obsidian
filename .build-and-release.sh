#!/bin/zsh
#───────────────────────────────────────────────────────────────────────────────

# goto git root
cd "$(git rev-parse --show-toplevel)" || return 1

# Prompt for next version number
current_version=$(plutil -extract version xml1 -o - info.plist | sed -n 's/.*<string>\(.*\)<\/string>.*/\1/p')
echo "current version: $current_version"
echo -n "   next version: "
read -r next_version
echo "────────────────────────"

# GUARD
if [[ -z "$next_version" || "$next_version" == "$current_version" ]]; then
	print "\033[1;31mInvalid version number.\033[0m"
	return 1
fi

# update version number in THE REPO'S `info.plist`
plutil -replace version -string "$next_version" info.plist

#───────────────────────────────────────────────────────────────────────────────
# INFO this assumes the local folder is named the same as the github repo
# 1. update version number in LOCAL `info.plist`
# 2. convenience: copy download link for current version

# update version number in LOCAL `info.plist`
prefs_location=$(defaults read com.runningwithcrayons.Alfred-Preferences syncfolder | sed "s|^~|$HOME|")
workflow_uid="$(basename "$PWD")"
local_info_plist="$prefs_location/Alfred.alfredpreferences/workflows/$workflow_uid/info.plist"
if [[ -f "$local_info_plist" ]] ; then 
	plutil -replace version -string "$next_version" "$local_info_plist"
else
	print "\033[1;33mCould not increment version, local \`info.plist\` not found: '$local_info_plist'\033[0m"
	return 1
fi

# copy download link for current version
msg="Available in the Alfred Gallery in 1-2 days, or directly by downloading the latest release here:"
github_user=$(git remote --verbose | head -n1 | sed -E 's/.*github.com[:\](.*)\/.*/\1/')
url="https://github.com/$github_user/$workflow_uid/releases/download/$next_version/${workflow_uid}.alfredworkflow"
echo -n "$msg $url" | pbcopy

#───────────────────────────────────────────────────────────────────────────────

# commit and push
git add --all &&
	git commit -m "release: $next_version" &&
	git pull --no-progress &&
	git push --no-progress &&
	git tag "$next_version" && # pushing a tag triggers the github release action
	git push --no-progress origin --tags
