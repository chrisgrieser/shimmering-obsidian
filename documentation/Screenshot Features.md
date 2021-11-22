[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Screenshot Features

## OCR Screenshots

<img src="https://i.imgur.com/xwdl1N5.gif" alt="OCR Screenshot" width=60% height=60%>

**`Triggered via Hotkey`: Take an OCR Screenshot.**
- Similar to the default Mac Hotkey `cmd + shift + 4`, you will be able to select part of your screen for a screenshot. However, instead of saving a screenshot, a new note will be created which contains the OCR-content of the selection.
- 💡 _Recommendation_: To stay in line with the other macOS keyboard shortcuts for taking screenshots, use something like `cmd + shift + 2` as hotkey.
- If the file “OCR-Screenshot” already exists in your vault root, any subsequent OCR-Screenshots will instead append to this note. This is intended for taking a lot of OCR-Screenshots in succession, e.g., during a lecture or presentation.
- You can change the prefix to OCR screenshots by changing the [workflow configuration](Workflow%20Configuration.md#OCR-Screenshots) `ocr_prefix`.
	- Use a different date format by following [Alfred's Placeholder-Syntax](https://www.alfredapp.com/help/workflows/advanced/placeholders/#date-time).
	- You can leave `ocr_prefix` empty or insert any other fixed value (e.g., a YAML-Header). 
	- 💡 While not very visible, the workflow configuration variables *do* accept multi-line values.
- For best results, you should set the proper languages to be recognized with the workflow setting `ocr_languages`.
- 💡 _The first time you use the OCR screenshot feature_, you might need to give Alfred permission to record your screen. You can do so under the macOS system settings (see image below).

<img src="https://user-images.githubusercontent.com/73286100/131231644-a800c0b0-8dc2-4ae9-bd41-c3937741b94a.png" alt="Permissions for OCR Screenshots" width=35%>

## Screenshot Features
*planned feature*
