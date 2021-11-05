[⏪ Go back to the Feature Overview](https://github.com/chrisgrieser/shimmering-obsidian/blob/main/README.md#feature-overview)

# Installation

## Hard Requirements
These requirements **need to be installed**, since this workflow cannot work without them.

| Name                                                                       | Type                      | Function                                                                                                                                                                          |
| -------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Powerpack for Alfred](https://www.alfredapp.com/powerpack/)               | Alfred Upgrade            | Needed to access advanced Alfred functionality. (Costs around 30€.)                                                                                                               |
| [Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri)         | Obsidian Community Plugin | Required for Alfred to be able to control Obsidian.                                                                                                                               |
| 🆕 [Metadata Extractor](https://github.com/kometenstaub/metadata-extractor) | Obsidian Community Plugin | Needed to read Obsidian metadata Third-Party Apps normally do not have access to. (see also [Information on Breaking Changes](Breaking%20Changes.md#New-Requirement)) |

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
- Configure the Metadata Extractor Plugin. It's **strongly recommended to set a frequency for periodic refreshing of the metadata.** (Otherwise, the metadata will be out of date soon). However, **do not** change any of the default values how the metadata extractor names its output files and where they are placed – otherwise this workflow won't be able to find them. See the [respective section of the workflow configuration](Workflow%20Configuration.md#Metadata-Extractor-Configuration).)
- In some cases, you have to allow _qlmarkdown_ to be executed before you can preview markdown notes via `shift` or `cmd + Y` (This is due to Big Sur's high security measures). Follow the [instructions here](https://github.com/toland/qlmarkdown/issues/98#issuecomment-607733093) to do that.
- After installing the workflow, **you need to configure the settings of this workflow to make use of most of its features.** Refer to the [Workflow Configuration](Workflow%20Configuration.md) for further information.
- 👉 Among other settings, you have to run `oupdate` → `Manually Refresh Metadata` once so the metadata is created.
- The first time you use the OCR screenshot feature, you might need to give Alfred permission to record your screen. You can do so under the macOS system settings (see image below).

<img src="https://user-images.githubusercontent.com/73286100/131231644-a800c0b0-8dc2-4ae9-bd41-c3937741b94a.png" alt="Permissions for OCR Screenshots" width=35% height=35%>

## Troubleshooting

---

**⚠️ You need to run the command `oupdate` → `Manually Refresh Metadata` once** before the Alfred-based Quick Switcher is able to work! Please refer to the documentation of the [metadata extractor configuration](/Workflow%20Configuration.md#metadata-extractor-configuration) for further information.

---

### Step 1: Common Solutions
- Make sure that all requirements are properly installed.
- Check the documentation of the malfunctioning feature.
- Update to the [latest version of the workflow](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest), chances are the problem has already been fixed.
- If you have trouble with OCR screenshots, ensure you have given Alfred permission to record your screen [as explained above](#-Workflow-Installation).
- In case the previewing of markdown notes via `shift` or `cmd + Y` does not work properly, make you have given `qlmarkdown` permission to run on your system [as explained above](#Workflow-Installation).
- If the [Quick Switcher of this workflow](Alfred-based%20Quick%20Switcher.md) cannot find a newly created or renamed note, but can otherwise find all other notes, you need to [use the `oupdate` command to refresh your metadata](Workflow%20Configuration#Metadata-Extractor-Configuration). You should also consider [increasing the frequency of metadata refreshing](Workflow%20Configuration#Metadata-Extractor-Configuration).
- If the Alfred-based Quick Switcher does not work at all, make sure you haven't changed any of the default settings of the [Metadata-Extractor regarding the location & name of the JSON files](Workflow%20Configuration#Metadata-Extractor-Configuration). You should also make sure that there are three `.json` files in in the folder `{{your-vault-path}}/.obsidian/plugins/metadata-extractor`. (The folder `.obsidian` is hidden by default in Finder, so you might have to [make it visible first](https://www.macworld.co.uk/how-to/show-hidden-files-mac-3520878/) to be able to navigate there.)

### Step 2: Contact
- If you did all of the above and there is still something not working, create an [issue on GitHub](https://github.com/chrisgrieser/shimmering-obsidian/issues), message me on the [Obsidian Discord Server](https://discord.gg/veuWUTm) (my username there is `@pseudometa#9546`), or write me on Twitter where my handle is [@pseudo_meta](https://twitter.com/pseudo_meta).
- When messaging me, describe which feature you are using in which situation, and be sure to attach a debugging log, a screenshot, and/or a [screen recording](https://support.apple.com/guide/quicktime-player/record-your-screen-qtp97b08e666/mac). 
- You can get a **debugging log** by opening the workflow in Alfred preferences and pressing `cmd + D`. A small window will open up which will log everything happening during the execution of the Workflow. Use the malfunctioning part of the workflow once more, copy the content of the log window, and attach it as text file.
