#!/bin/zsh

input="$*"
cd "$alfred_workflow_data"

# write buffer
echo -n "$input" > buffer_inputPath

# append to log buffer
echo "$input" >> buffer_log

# to Alfred debugging log stderr
cat buffer_log | tail -n1 > 2
