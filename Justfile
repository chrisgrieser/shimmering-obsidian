set quiet := true

# REQUIRED local workflow uses same folder name

workflow_uid := `basename "$PWD"`
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
    git status --short .

[macos]
open-local-workflow-in-alfred:
    #!/usr/bin/env zsh
    # using JXA and URI for redundancy, as both are not 100 % reliable https://www.alfredforum.com/topic/18390-get-currently-edited-workflow-uri/
    open "alfredpreferences://navigateto/workflows>workflow>{{ workflow_uid }}"
    osascript -e 'tell application id "com.runningwithcrayons.Alfred" to reveal workflow "{{ workflow_uid }}"'

release:
    ./.build-and-release.sh
