[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Screenshot Features

## OCR Screenshots

<img src="https://i.imgur.com/xwdl1N5.gif" alt="OCR Screenshot" width=60% height=60%>

**`Triggered via Hotkey`[^1]: Take an OCR Screenshot.**
- Similar to the default Mac Hotkey `⌘ ⇧ + 4`, you will be able to select part of your screen for a screenshot. However, instead of saving a screenshot, a new note will be created which contains the OCRed content of the selection.
- If the file “OCR-Screenshot.md” already exists in your vault root, any subsequent OCR screenshots will instead append to this note. This is intended for taking OCR screenshots in quick succession, e.g., during a live lecture or presentation.
- You can change the prefix to OCR screenshots by changing the [workflow configuration](Workflow%20Configuration.md#Screenshot-Features) `ocr_prefix`.
	- Use a different date format by following [Alfred's Placeholder-Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time).
	- You can leave `ocr_prefix` empty or insert any other fixed value (e.g., a YAML-Header). 
	- 💡 While not very visible, the workflow configuration variables *do* accept multi-line values.
- For best results, you should set the proper languages to be recognized with the workflow setting `ocr_languages`.
- When the [workflow configuration](Workflow%20Configuration.md#Screenshot-Features) `open_after_screenshot` is set to `true`, then the note will be opened after taking the screenshot. 💡 Set this to `false` to take OCR screenshots in quick succession without opening Obsidian.
- 💡 _The first time you use the OCR screenshot feature_, you might need to give Alfred permission to record your screen. You can do so under the macOS system settings (see image below).

<img src="https://user-images.githubusercontent.com/73286100/131231644-a800c0b0-8dc2-4ae9-bd41-c3937741b94a.png" alt="Permissions for OCR Screenshots" width=35%>

## Image Screenshot
**`Triggered via Hotkey`[^1]: Take an Image Screenshot.**
- Similar to the default Mac Hotkey `⌘ ⇧ + 4`, you will be able to select part of your screen for a screenshot. The image will be directly saved in your vault with the file name `Screenshot {date} {time}.png` and the image will be embedded (`![[image_file_name.png]]`) in the note `Images.md` in your vault root.
- The images will be saved in `{vault-path}/screenshots/` by default. You can use the [workflow configuration](Workflow%20Configuration.md#Screenshot-Features) `screenshot_path` to specify the *absolute* path of a folder in your vault where to save the images instead. 
- If the file “Images.md” already exists in your vault root, any subsequent screenshots will instead append to this note. This is intended for taking screenshots in quick succession, e.g., during a live lecture or presentation.
- When the [workflow configuration](Workflow%20Configuration.md#Screenshot-Features) `open_after_screenshot` is set to `true`, then the note will be opened after taking the screenshot. 💡 Set this to `false` to take OCR screenshots in quick succession without opening Obsidian.

[^1]: 💡 To stay in line with the other macOS keyboard shortcuts for taking screenshots, you can use something like `⌘⇧ + 1` as hotkey.
