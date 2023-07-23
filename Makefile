.PHONY: transfer-local-files, release
#───────────────────────────────────────────────────────────────────────────────

transfer-local-files:
	workflow_id=$$(basename "$$PWD") && \
	prefs_location=$$(grep "5" "$$HOME/Library/Application Support/Alfred/prefs.json" | cut -d'"' -f4 | sed -e 's|\\/|/|g' -e "s|^~|$$HOME|") && \
	local_workflow="$$prefs_location/Alfred.alfredpreferences/workflows/$$workflow_id" && \
	cp -fR "$$local_workflow/"* "$$PWD/"

release:
	zsh ./build-and-release.sh
