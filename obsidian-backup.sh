#!/bin/zsh
timestamp=`date '+%Y-%m-%d_%H-%M'`
resolved_bkp_dest=~`echo -n $backup_destination | sed -e "s/^~//"`
backup="$resolved_bkp_dest""/Obsidian-Backup_""$timestamp"".zip"
vault=~`echo -n $vault_path | sed -e "s/^~//"`

# directory change necessary to avoid zipping root folder https://unix.stackexchange.com/questions/245856/zip-a-file-without-including-the-parent-directory
# "*" only matches non-hidden files, therefore adding them manually.
# several stackexchange-solutions for changing *" to match hidden files
# do not work or create character-encoding issues, therefore explicitly
# naming them.
cd $vault
zip -r --quiet $backup ./* ./.obsidian/* ./.trash/*

# restrict number of backups
actual_number=$((max_number_of_bkps + 1))
cd $resolved_bkp_dest
ls -t | tail -n +$actual_number | tr '\n' '\0' | xargs -0 rm

echo "$backup"