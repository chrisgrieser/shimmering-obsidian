#!/bin/zsh

# resolve ~
snippet="${toggle_snippet/#\~/$HOME}"

snippet_css="${snippet##*/}"
snippet_without_ext="${snippet_css%.*}"
state=`cat "$snippet"`

if [[ $state == '' ]]
then
	# turn back on
	cp "$snippet"".bkp" "$snippet"
	echo -n "🟡 '$snippet_without_ext' turned on."
else
	# turn off
	cp "$snippet" "$snippet"".bkp"
	echo "" > "$snippet"
	echo -n "⚫️ '$snippet_without_ext' turned off."
fi
