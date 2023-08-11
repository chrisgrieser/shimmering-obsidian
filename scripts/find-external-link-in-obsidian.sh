#!/usr/bin/env zsh

# cd to vault
# shellcheck disable=2154
cd "$vault_path" || return 1

# escape square brackets for grep
mdlink=$(echo "$*" | sed -e 's|\[|\\[|' -e 's|\]|\\]|')

# grep link location, cut file path & line number
grep -n "$mdlink" ./**/*.md | cut -d: -f1-2
