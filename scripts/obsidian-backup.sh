#!/bin/zsh
# shellcheck disable=2154
set -e
#───────────────────────────────────────────────────────────────────────────────

timestamp=$(date '+%Y-%m-%d_%H-%M')
backup_destination="${backup_destination/#\~/$HOME}"
backup="$backup_destination/Obsidian-Backup_$timestamp.zip"

mkdir -p "$backup_destination"
cd "$vault_path"
zip --recurse-paths --symlinks --quiet "$backup" .

# restrict number of backups
actual_number=$((max_number_of_bkps + 1))
cd "$backup_destination"
# shellcheck disable=2012 # filename above is alphanumeric
ls -t | tail -n +$actual_number | tr '\n' '\0' | xargs -0 rm

# Alfred notification
echo -n "$backup"
