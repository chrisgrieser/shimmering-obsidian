#!/bin/zsh
export PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH

pbpaste > temp.svg
svgDataURI=$(mini-svg-data-uri temp.svg | sed -e "s/width='1em' //" | sed -e "s/height='1em' //" | sed -e "s/xmlns:.*role='img' //")
rm temp.svg

cssReady="svg.PLACEHOLDER > path { display: none }\n\nsvg.PLACEHOLDER {\n\tbackground-color: currentColor;\n\t-webkit-mask-image: url(\"$svgDataURI\");\n}"

echo "$cssReady" | pbcopy

# paste on mac
osascript -e 'tell application "System Events" to keystroke "v" using {command down}'
