#!/usr/bin/env zsh

vault_path="$(cat ./vaultPath)" && vault_path="${vault_path/#\~/$HOME}"
open "$vault_path/$*"
