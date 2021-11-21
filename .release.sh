#!/bin/zsh

# prompt for version
lastVersion=$(plutil -extract version xml1 -o - info.plist | sed -n 4p | cut -d">" -f2 | cut -d"<" -f1)
echo "Last Version: $lastVersion"
echo -n "Next Version: "
read newVersion

# Close Alfred Prefs to avoid conflicts
osascript -e 'tell application "Alfred Preferences" to if it is running then quit'

# insert new version number
plutil -replace version -string "$newVersion" info.plist

# bkp
cp -v info.plist info-original.plist

# create clean info.plist for release
osascript -l JavaScript ".release-plist-edit.js"

# remove any potentially existing leftover workflow file
mv -v *.alfredworkflow ~/.trash

# zip
zip --quiet -r "Shimmering Obsidian.alfredworkflow" . -x ".git/*" ".github/*" "documentation/*" ".release.js" "README.md" ".DS_Store" "*.alfredworkflow"

# restore original
mv -v info.plist ~/.trash
mv -v info-original.plist info.plist

# push to remote
git add -A
git commit -m "version bump to $newVersion"
git push
