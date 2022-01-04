#!/bin/zsh
open "obsidian://advanced-uri?vault=""$vault_name_ENC""&commandid=metadata-extractor%253Awrite-metadata-json"
open "obsidian://advanced-uri?vault=""$vault_name_ENC""&commandid=metadata-extractor%253Awrite-tags-json"
open "obsidian://advanced-uri?vault=""$vault_name_ENC""&commandid=metadata-extractor%253Awrite-allExceptMd-json"
