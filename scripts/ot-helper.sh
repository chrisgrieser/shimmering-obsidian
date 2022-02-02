#!/bin/zsh

tag="$*"
mkdir -p "$alfred_workflow_data"
cd "$alfred_workflow_data"

# write buffer
echo -n "$tag" > buffer_selectedTag

# append to log buffer
echo "[tag]            ""$tag" >> buffer_log

# to Alfred debugging log stderr
cat buffer_log | tail -n1 > 2
