.PHONY: transfer-repo-to-local transfer-local-to-repo release
#───────────────────────────────────────────────────────────────────────────────

transfer-local-to-repo:
	workflow_id=$$(basename "$$PWD") && \
	prefs_location=$$(grep "5" "$$HOME/Library/Application Support/Alfred/prefs.json" | cut -d'"' -f4 | sed -e 's|\\/|/|g' -e "s|^~|$$HOME|") && \
	local_workflow="$$prefs_location/Alfred.alfredpreferences/workflows/$$workflow_id" && \
	rsync --archive --delete --exclude-from="$$PWD/.rsync-exclude" "$$local_workflow/" "$$PWD" ; \
	git status --short

transfer-repo-to-local:
	workflow_id=$$(basename "$$PWD") && \
	prefs_location=$$(grep "5" "$$HOME/Library/Application Support/Alfred/prefs.json" | cut -d'"' -f4 | sed -e 's|\\/|/|g' -e "s|^~|$$HOME|") && \
	local_workflow="$$prefs_location/Alfred.alfredpreferences/workflows/$$workflow_id" && \
	rsync --archive --delete --exclude-from="$$PWD/.rsync-exclude" "$$PWD/" "$$local_workflow" ; \

release:
	zsh ./.build-and-release.sh
