[⏪ Go back to the Feature Overview](../README.md#feature-overview)

# Installation

## Requirements
These requirements **need to be installed**, since this workflow cannot work without them.

| Name                                                                       | Type                      | Function                                                                                                                                                                          |
| -------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Powerpack for Alfred](https://www.alfredapp.com/powerpack/)               | Alfred Upgrade            | Needed to access advanced Alfred functionality. (Costs around 30€.)                                                                                                               |
| [Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri)         | Obsidian Community Plugin | Required for Alfred to be able to control Obsidian.                                                                                                                               |
| [Metadata Extractor](https://github.com/kometenstaub/metadata-extractor) | Obsidian Community Plugin | Needed to read Obsidian metadata Third-Party Apps normally do not have access to. (see also [Information on Breaking Changes](Breaking%20Changes.md#New-Requirement)) |

## Workflow Installation
1. Install the requirements listed above. (ℹ️ When you have multiple vaults, you have to install them in each.)
2. Download the [latest release at GitHub](https://github.com/chrisgrieser/shimmering-obsidian/releases/latest). Double-click the `.alfredworkflow` file to install it.
3. Run the Alfred Command `osetup` and select the vault you want to control with _Shimmering Obsidian_. Obsidian will then restart.[^1] Even if you have only one vault, you need to confirm that one vault once before you can use the workflow.
4. _Recommended:_ After installing the workflow, you should configure the settings of this workflow to make use of most of its features. Refer to the [Workflow Configuration](Workflow%20Configuration.md) for further information.


## Optional Requirements
These requirements are *only necessary for specific features* of this workflow. If you do not plan to use the respective feature, you can forego installing the requirement for it. It is recommended to install all requirements listed here to be able to use all features of _Shimmering Obsidian_.

| Name                                                                   | Type                      | Function                                                                                        |
| ---------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| [Hotkey-Helper](https://github.com/pjeby/hotkey-helper)[^2]                | Obsidian Community Plugin | used to open plugins and their configuration directly in Obsidian via `op`                      |
| [Tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) | Third-Party Software      | needed for [OCR screenshots](Screenshot%20Features.md#OCR-Screenshots)                                                                  |
| [qlmarkdown](https://github.com/sbarex/QLMarkdown)                    | Third-Party Software      | used to preview markdown notes with `shift` or `cmd + Y` when searching with `o`, `or`, or `os` |

If you have [Homebrew](https://brew.sh/), Tesseract and qlmarkdown can by installed via the following terminal commands:

```bash
brew install tesseract
brew install tesseract-lang # for non-English languages
brew install qlmarkdown --cask
```

### QLMarkdown
QLMarkdown must be started at least once.



[^1]: _Shimmering Obsidian_ can only control one vault at a time. However, you can switch between the vaults that you want to control with the [Vault Switcher](Vault%20Switcher.md).
[^2]: From Release 0.13+ on, the Hotkey Helper Plugin won't be needed anymore.  
