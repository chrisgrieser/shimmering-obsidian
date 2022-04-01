#!/bin/zsh
# shellcheck disable=SC2154
open -a "Obsidian"
sleep 1
open "obsidian://advanced-uri?vault=$vault_name_ENC&commandid=metadata-extractor%253Awrite-metadata-json"
sleep 0.5
open "obsidian://advanced-uri?vault=$vault_name_ENC&commandid=metadata-extractor%253Awrite-tags-json"
sleep 0.5
open "obsidian://advanced-uri?vault=$vault_name_ENC&commandid=metadata-extractor%253Awrite-allExceptMd-json"
