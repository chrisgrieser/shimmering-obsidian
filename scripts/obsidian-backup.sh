#!/bin/zsh
# shellcheck disable=2154

timestamp=$(date '+%Y-%m-%d_%H-%M')
backup_destination="${backup_destination/#\~/$HOME}"
backup="$backup_destination/Obsidian-Backup_$timestamp.zip"

# directory change necessary to avoid zipping root folder https://unix.stackexchange.com/questions/245856/zip-a-file-without-including-the-parent-directory
# "./.*" matches all hidden files, including `.git`, which inflates the backup size,
# therefore explicitly naming the three hidden files that should be backuped
mkdir -p "$backup_destination"
cd "$vault_path" || exit 1
zip --recurse-paths --symlinks --quiet "$backup" .

# restrict number of backups
actual_number=$((max_number_of_bkps + 1))
cd "$backup_destination" || exit 1
# shellcheck disable=2012
ls -t | tail -n +$actual_number | tr '\n' '\0' | xargs -0 rm

# for notification
echo "$backup"
