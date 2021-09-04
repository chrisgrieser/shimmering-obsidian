#!/bin/zsh
timestamp=`date '+%Y-%m-%d_%H-%M'`
resolved_bkp_dest="${backup_destination/#\~/$HOME}"
backup="$resolved_bkp_dest""/Obsidian-Backup_""$timestamp"".zip"
vault="${vault_path/#\~/$HOME}"

# ensure trash folder exists and see whether there are items there
mkdir "$vault"/.trash
itemCount=`ls "$vault" | wc -l`

# directory change necessary to avoid zipping root folder https://unix.stackexchange.com/questions/245856/zip-a-file-without-including-the-parent-directory
# "*" only matches non-hidden files, therefore adding them manually.
# several stackexchange-solutions for changing *" to match hidden files
# do not work or create character-encoding issues, therefore explicitly
# naming them.
cd $vault

if [[ $itemCount > 0 ]] ; then
	zip -r --quiet $backup ./* ./.obsidian/* ./.trash/*
else
	zip -r --quiet $backup ./* ./.obsidian/*
fi

# restrict number of backups
actual_number=$((max_number_of_bkps + 1))
cd $resolved_bkp_dest
ls -t | tail -n +$actual_number | tr '\n' '\0' | xargs -0 rm

echo "$backup"
