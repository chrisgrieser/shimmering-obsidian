#!/bin/zsh
export PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH

temp_image="$alfred_workflow_cache""/temp_ocr_snapshot.png"
mkdir -p "$alfred_workflow_cache"
screencapture -i "$temp_image"
tesseract "$temp_image" stdout -l $ocr_languages 2>&1
