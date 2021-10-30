[⏪ Go back to the Feature Overview](https://github.com/chrisgrieser/shimmering-obsidian/blob/main/README.md#feature-overview)

# Installation

## Hard Requirements
These requirements **need to be installed**, since this workflow cannot work without them.

| Name                                                                       | Type                      | Function                                                                                                                                                                          |
| -------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Powerpack for Alfred](https://www.alfredapp.com/powerpack/)               | Alfred Upgrade            | Needed to access advanced Alfred functionality. (Costs around 30€.)                                                                                                               |
| [Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri)         | Obsidian Community Plugin | Required for Alfred to be able to control Obsidian.                                                                                                                               |
| 🆕 [Metadata Extractor](https://github.com/kometenstaub/metadata-extractor) | Obsidian Community Plugin | Needed to read Obsidian metadata Third-Party Apps normally do not have access to. (see also [Information on Breaking Changes](documentation/Breaking Changes.md#New Requirement)) |

## Soft Requirements
These requirements are only necessary for specific features of this workflow. If you do not plan to use the respective feature, you can forego installing the requirement for it. It is recommended to install all requirements listed here to be able to use all features of _Shimmering Obsidian_.

| Name                                                                   | Type                      | Function                                                                                        |
| ---------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| [Hotkey-Helper](https://github.com/pjeby/hotkey-helper)                | Obsidian Community Plugin | used to open plugins and their configuration directly in Obsidian via `op`                      |
| [Tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) | Third-Party Software      | needed for **OCR screenshots**                                                                  |
| [qlmarkdown](https://github.com/toland/qlmarkdown/)                    | Third-Party Software      | used to preview markdown notes with `shift` or `cmd + Y` when searching with `o`, `or`, or `os` |

If you have [Homebrew](https://brew.sh/), Tesseract and qlmarkdown can by installed via the following terminal commands:

```bash
brew install tesseract
brew install tesseract-lang
brew install qlmarkdown
```

## Workflow Installation
- Install the requirements listed above.
- Download the [latest release at GitHub](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest). Double-click the `.alfredworkflow` file.
- In some cases, you have to allow _qlmarkdown_ to be executed before you can preview markdown notes via `shift` or `cmd + Y` (This is due to Big Sur's high security measures). Follow the [instructions here](https://github.com/toland/qlmarkdown/issues/98#issuecomment-607733093) to do that.
- The first time you use the OCR screenshot feature, you might need to give Alfred permission to record your screen. You can do so under the macOS system settings (see image below).
- After installing the workflow, you need to configure the settings of this workflow to make use of most of its features. Refer to the [Workflow Configuration](documentation/Workflow%20Configuration.md) for further information.
- Do **not** change the default settings of the metadata extractor plugin, regarding the name and location of the metadata files, otherwise this workflow will not be able to read them. For further information, see the [respective section of the workflow configuration](documentation/Workflow%20Configuration#Metadata%20Extractor%20Settings).

<img src="https://user-images.githubusercontent.com/73286100/131231644-a800c0b0-8dc2-4ae9-bd41-c3937741b94a.png" alt="Permissions for OCR Screenshots" width=35% height=35%>

## Troubleshooting
- Make sure that all requirements are properly installed.
- Check the documentation of the malfunctioning feature.
- Update to the latest version of the workflow, chances are the problem has already been fixed.
- For workflow settings which require a file or path, you usually have to enter the *full absolute path including file extension*, leading with a`/` and without a trailing `/`. Do **not** use a vault-relative path.
- If you have trouble with OCR screenshots, ensure you have given Alfred permission to record your screen as explained above.
- In case the previewing of markdown notes via `shift` or `cmd + Y` does not work properly, make you have given "qlmarkdown" permission run on your system as explained above.
- If you did all of the above and there is still something not working, create an [issue](https://github.com/chrisgrieser/shimmering-obsidian/issues), message me on the [Obsidian Discord Server](https://discord.gg/veuWUTm) (my username there is `@pseudometa#9546`), or write me on Twitter where my handle is [@pseudo_meta](https://twitter.com/pseudo_meta).
- Be sure to attach a debugging log, a screenshot, or a [screen recording](https://support.apple.com/guide/quicktime-player/record-your-screen-qtp97b08e666/mac) so I can figure out the issue.
- You can get a **debugging log** by opening the workflow in Alfred preferences and pressing `cmd + D`. A small window will open up which will log everything happening during the execution of the Workflow. Use the malfunctioning part of the workflow once more, copy the content of the log window, and attach it as text file.
