#!/bin/zsh
url="$*"
frontmost=$(osascript -e 'tell application "System Events" to get name of application processes whose frontmost is true and visible is true')

if [[ "$frontmost" =~ Discord ]]; then
	echo -n "<$url>"
else
	echo -n "$url"
fi
