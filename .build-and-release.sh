#!/bin/zsh

# goto git root
cd "$(git rev-parse --show-toplevel)" || return 1

#───────────────────────────────────────────────────────────────────────────────

# Prompt for next version number
current_version=$(plutil -extract version xml1 -o - info.plist | sed -n 's/.*<string>\(.*\)<\/string>.*/\1/p')
echo "current version: $current_version"
echo -n "   next version: "
read -r next_version
echo "────────────────────────"

# GUARD
if [[ -z "$next_version" || "$next_version" == "$current_version" ]]; then
	print "\e[1;31mInvalid version number.\e[0m"
	return 1
fi

#───────────────────────────────────────────────────────────────────────────────
# update version number in THE REPO's `info.plist`
plutil -replace version -string "$next_version" info.plist

# update version number in LOCAL `info.plist`
# INFO this assumes the local folder is named the same as the github repo

# update version number in LOCAL `info.plist`
prefs_location=$(defaults read com.runningwithcrayons.Alfred-Preferences syncfolder | sed "s|^~|$HOME|")
workflow_uid="$(basename "$PWD")"
local_info_plist="$prefs_location/Alfred.alfredpreferences/workflows/$workflow_uid/info.plist"
if [[ -f "$local_info_plist" ]]; then
	plutil -replace version -string "$next_version" "$local_info_plist"
else
	print "\e[1;33mCould not increment version, local \`info.plist\` not found: '$local_info_plist'\e[0m"
	return 1
fi

#───────────────────────────────────────────────────────────────────────────────

# copy download link for current version, to share it when closing issues
msg="Available in the Alfred Gallery in 1-2 days, or directly by downloading the latest release here:"
repo=$(git remote --verbose | head -n1 | sed -E 's/.*github.com:([^[:space:]]*).*/\1/')
url="https://github.com/$repo/releases/download/$next_version/$workflow_uid.alfredworkflow"
echo -n "$msg $url" | pbcopy

#───────────────────────────────────────────────────────────────────────────────

# Submit update at Alfred Gallery
last_release_commit=$(git log --grep="^release: " -n1 --pretty=format:"%H")
if [[ -z "$last_release_commit" ]]; then
	root_commit=$(git rev-list --max-parents=0 HEAD)
	last_release_commit=$root_commit
fi
changelog=$(git log "$last_release_commit"..HEAD --format='- %s' |
	grep --extended-regexp --invert-match '^- (build|ci|release|chore|test)' |
	sed -Ee "s/^- ([^ ]+): /- **\1**: /" |
	jq --raw-input --slurp --null-input --raw-output 'input | @uri') # url-encode
if [[ -n "$changelog" ]]; then
	repo=$(git remote --verbose | head -n1 | sed -E 's/.*github.com:([^[:space:]]*).*/\1/')
	gallery_url="https://github.com/$repo" # github-url also okay for Alfred devs
	open "https://github.com/alfredapp/gallery-edits/issues/new?template=02_update_workflow.yml&title=Update+Workflow:+$repo&gallery_url=$gallery_url&new_version=$next_version&changelog=$changelog"
else
	echo "Only internal changes, thus not submitting update at Alfred Gallery."
	echo
fi

#───────────────────────────────────────────────────────────────────────────────

# commit and push
git add --all &&
	git commit -m "release: $next_version" &&
	git pull --no-progress &&
	git push --no-progress &&
	git tag "$next_version" && # pushing a tag triggers the github release action
	git push --no-progress origin --tags
