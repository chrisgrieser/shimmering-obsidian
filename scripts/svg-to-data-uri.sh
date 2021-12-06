#!/bin/zsh
export PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH

if [[ "$svg_size" == "" ]] ; then
	svg_size="1em"
fi

pbpaste > temp.svg
svgDataURI=$(mini-svg-data-uri temp.svg | sed -e "s/width='1em'/width='$svg_size'/" | sed -e "s/height='1em'/height='$svg_size'/")
rm temp.svg

cssReady="svg.PLACEHOLDER > path {\n\tdisplay: none;\n}\n\nsvg.PLACEHOLDER {\n\tbackground-color: currentColor;\n\t-webkit-mask-image: url(\"$svgDataURI\");\n}"

echo "$cssReady" | pbcopy
