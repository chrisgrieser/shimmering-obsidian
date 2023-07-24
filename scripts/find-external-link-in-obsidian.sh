#!/usr/bin/env zsh

# cd to vault
# shellcheck disable=2154
vault_path="$(cat "$alfred_workflow_data/vaultPath")" && vault_path="${vault_path/#\~/$HOME}"
cd "$vault_path" || return 1

# escape square brackets for grep
mdlink=$(echo "$*" | sed -e 's|\[|\\[|' -e 's|\]|\\]|')

# grep link location, cut file path & line number
grep -n "$mdlink" ./**/*.md | cut -d: -f1-2
