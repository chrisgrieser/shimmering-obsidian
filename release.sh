#!/bin/zsh
# ALFRED WORKFLOW RELEASE
#───────────────────────────────────────────────────────────────────────────────

# goto git root
cd "$(git rev-parse --show-toplevel)" || return 1

#───────────────────────────────────────────────────────────────────────────────
# BUMP VERSION NUMBER

# Prompt for next version number
nextVersion="$*"
currentVersion=$(plutil -extract version xml1 -o - info.plist | sed -n 4p | cut -d">" -f2 | cut -d"<" -f1)
echo "current version: $currentVersion"
echo -n "   next version: "
read -r nextVersion
echo

# Insert next version number
plutil -replace version -string "$nextVersion" info.plist
localInfoPlist="$DOTFILE_FOLDER/Alfred.alfredpreferences/workflows/$(basename "$PWD")/info.plist"
if [[ -f "$localInfoPlist" ]]; then
	plutil -replace version -string "$nextVersion" "$localInfoPlist"
fi

#───────────────────────────────────────────────────────────────────────────────
# COMPILE ALFREDWORKFLOW FILE

# backup info.plist
cp -v info.plist info-original.plist # backup

# remove variables flagged as "no export" from info.plist
if plutil -extract variablesdontexport json -o - info.plist &>/dev/null; then
	excludedVars=$(plutil -extract variablesdontexport json -o - info.plist | tr -d "[]\"" | tr "," "\n")
	echo "$excludedVars" | tr "\n" "\0" | xargs -0 -I {} plutil -replace variables.{} -string "" info.plist
fi

# remove workflow file from previous release
rm -fv ./*.alfredworkflow

# zip
workflowName=$(plutil -extract name xml1 -o - info.plist | sed -n 4p | cut -d">" -f2 | cut -d"<" -f1 | tr " " "-")
zip --quiet --recurse-paths "$workflowName.alfredworkflow" . \
	--exclude ".git*" "info-original.plist" "prefs.plist" "*.alfredworkflow"

# restore original
rm -fv info.plist && mv -fv info-original.plist info.plist

#───────────────────────────────────────────────────────────────────────────────
# GIT OPERATIONS

git add -A
git commit -m "release $nextVersion"
git pull
git push

# trigger the release action via github action
git tag "$nextVersion"
git push origin --tags
