#!/bin/zsh

# ALFRED WORKFLOW RELEASE
# -----------------------

# Requirements
# - markdownlint
# - markdown-link-check
# - eslint

# -----------------------
# new version number
# -----------------------

# Prompt for version number, if not entered
nextVersion="$*"
currentVersion=$(plutil -extract version xml1 -o - info.plist | sed -n 4p | cut -d">" -f2 | cut -d"<" -f1)
echo "current version: $currentVersion"
echo -n "   next version: "
if [[ -z "$nextVersion" ]]; then
	read -r nextVersion
else
	echo "$nextVersion"
fi
echo ""

# Close Alfred Prefs to avoid conflicts
osascript -e 'tell application "Alfred Preferences" to if it is running then quit'

# insert new version number
plutil -replace version -string "$nextVersion" info.plist

# Lint
cd "$(dirname "$0")" || exit 1
# TODO: lint some older files
eslint . --config ~"/Library/Mobile Documents/com~apple~CloudDocs/Dotfolder/Configs/.eslintrc.json" --fix # needs explicit reference to config file: https://eslint.org/docs/user-guide/migrating-to-7.0.0#-runtime-deprecation-warnings-for-eslintrc-config-files
markdownlint --fix ./README.md
markdownlint --fix ./docs/*.md
markdown-link-check -q ./README.md

echo ""

# -----------------------
# clean info.plist
# -----------------------

# bkp info.plist
cp -v info.plist info-original.plist

# list of all variables to be excluded
excludedVars=$(plutil -extract variablesdontexport json -o - info.plist | tr -d "[]\"" | tr "," "\n")

# remove from info.plist
echo "$excludedVars" | tr "\n" "\0" | xargs -0 -I § plutil -replace variables.§ -string "" info.plist

# report excluded number
exclusionNo=$(echo "$excludedVars" | wc -l | tr -d " ")
echo "Removed $exclusionNo variables flagged as 'no export' removed from 'info.plist'."

# -----------------------
# compile .alfredworkflow
# -----------------------

# remove any potentially existing leftover workflow file
mv -fv ./*.alfredworkflow ~/.trash

# zip
workflowName=$(plutil -extract name xml1 -o - info.plist | sed -n 4p | cut -d">" -f2 | cut -d"<" -f1)
workflowName=$(echo "$workflowName" | tr " " "-")
zip --quiet -r "$workflowName.alfredworkflow" . -x ".git/*" ".github/*" "documentation/*" ".release.sh" ".gitignore" "info-original.plist" ".release-plist-edit.js" "README.md" ".DS_Store" "*.alfredworkflow"
echo "new $workflowName.alfredworkflow file created."

# restore original
mv -fv info.plist ~/.trash
mv -v info-original.plist info.plist
echo ""

# -----------------------
# git
# -----------------------

# update changelog
echo "- $(date +"%Y-%m-%d")	release $nextVersion" > ./Changelog.md
git log --pretty=format:"- %ad%x09%s" --date=short | grep -Ev "minor$" | grep -Ev "patch$" | grep -Ev "typos?$" | grep -v "refactoring" | grep -v "Add files via upload" | grep -Ev "\tDelete" | grep -Ev "\tUpdate.*\.md" | sed -E "s/\t\+ /\t/g" >> ./Changelog.md

git add -A
git commit -m "release $nextVersion"

git pull
git push

# trigger the release action
git tag "$nextVersion"
git push origin --tags
