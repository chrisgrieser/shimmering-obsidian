#!/bin/zsh

# ALFRED WORKFLOW RELEASE
# -----------------------
# Requirements
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

# insert new version number
plutil -replace version -string "$nextVersion" info.plist

# Lint
cd "$(dirname "$0")" || exit 1
eslint . --fix

echo ""

# -----------------------
# clean info.plist
# -----------------------

# bkp info.plist
cp -v info.plist info-original.plist

# remove variables flagged as "no export" from info.plist
if plutil -extract variablesdontexport json -o - info.plist &> /dev/null ; then
	excludedVars=$(plutil -extract variablesdontexport json -o - info.plist | tr -d "[]\"" | tr "," "\n")
	echo "$excludedVars" | tr "\n" "\0" | xargs -0 -I {} plutil -replace variables.{} -string "" info.plist

	exclusionNo=$(echo "$excludedVars" | wc -l | tr -d " ")
	echo "Removed $exclusionNo variables flagged as 'no export' removed from 'info.plist'."
fi

# -----------------------
# compile .alfredworkflow
# -----------------------

# remove workflow file from previous release
rm -fv ./*.alfredworkflow

# zip
workflowName=$(plutil -extract name xml1 -o - info.plist | sed -n 4p | cut -d">" -f2 | cut -d"<" -f1)
workflowName=$(echo "$workflowName" | tr " " "-")
zip --quiet -r "$workflowName.alfredworkflow" . -x ".*" "promo*.png" "doc*/*" ".gitignore" "info-original.plist" "prefs.plist" "README.md" "*.alfredworkflow"
echo "new $workflowName.alfredworkflow file created."

# restore original
rm -fv info.plist
mv -fv info-original.plist info.plist
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
