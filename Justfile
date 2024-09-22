set quiet := true

workflow_uid := `basename "$PWD"` # REQUIRED local workflow uses same folder name
prefs_location := `defaults read com.runningwithcrayons.Alfred-Preferences syncfolder | sed "s|^~|$HOME|"`
local_workflow := prefs_location / "Alfred.alfredpreferences/workflows" / workflow_uid

#───────────────────────────────────────────────────────────────────────────────

transfer-changes-FROM-local:
    #!/usr/bin/env zsh
    rsync --archive --delete --exclude-from="$PWD/.rsync-exclude" "{{ local_workflow }}/" "$PWD"
    git status --short

transfer-changes-TO-local:
    #!/usr/bin/env zsh
    rsync --archive --delete --exclude-from="$PWD/.rsync-exclude" "$PWD/" "{{ local_workflow }}"
    cd "{{ local_workflow }}" 
    git status --short

release:
    zsh ./.build-and-release.sh
