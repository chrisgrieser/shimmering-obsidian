#!/usr/bin/env zsh

vault_path="$(cat "$alfred_workflow_data/vaultPath")" && vault_path="${vault_path/#\~/$HOME}"
open "$vault_path/$*"
