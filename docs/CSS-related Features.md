---
nav_order: 2
---

# CSS-related Features

## Table of Contents
<!-- MarkdownTOC -->

- [Open & Create your CSS Files](#open--create-your-css-files)
- [Theme Search](#theme-search)
- [Quick SVG Data URI Conversion](#quick-svg-data-uri-conversion)
- [For Theme Designers: Quick Font File Conversion](#for-theme-designers-quick-font-file-conversion)
- [For Theme Designers: Cheat Sheets](#for-theme-designers-cheat-sheets)

<!-- /MarkdownTOC -->

## Open & Create your CSS Files
**`ocss`: Access your `css` files.**
- Open a theme or CSS snippet in your default text editor.
- Access the “themes” or “snippets” folder located in `.obsidian` in Finder.
- Create a **new CSS snippet** in mere seconds: The CSS file will be placed in your snippet folder, filled with your clipboard content, named after the query you enter after `ocss`, and then opened in your default text editor. Furthermore, this will open the Obsidian Settings in the background, to save you yet another click. 🙂

## Theme Search
➡️ Refer to the [Plugin & Theme Search](Plugin%20and%20Theme%20Search.md#Themes) for information on the theme search capabilities.
- Useful for 🎨 theme designers will be the `fn + return` command to quickly download any theme's CSS.

<img src="https://user-images.githubusercontent.com/73286100/131255059-1a56d6e7-8c2f-4ff0-b20d-247702bb7925.gif" alt="Theme Search" width=60%>

## Quick SVG Data URI Conversion
**🆕 `osvg`: Convert convert the `svg` in your clipboard to Data URI.**
- [Explainer why converting SVGs is useful](https://css-tricks.com/lodge/svg/09-svg-data-uris/).
- Takes the .svg files in you clipboard, converts it to a SVG Data URI, and copies it wrapped in CSS into your clipboard.
- You can use <https://icon-sets.iconify.design/> to browse for icons as SVG.
- ❗️ This command requires [`mini-svg-data-uri`](https://www.npmjs.com/package/mini-svg-data-uri), which you can easily install via `npm -g install mini-svg-data-uri`.

![SVG to Data URI Conversion](https://user-images.githubusercontent.com/73286100/144687883-102e4e1b-6227-4b56-afce-416ca0b08b80.gif)

## For Theme Designers: Quick Font File Conversion
**`Triggered via Universal Action`: Convert a font file to CSS with base64.**
- This will take the selected font file (e.g., `.tff` or `.woff`), convert them into base64, prompt you for the correct format, and copies base64-encoded font wrapped in CSS into your clipboard.
- See the Alfred Documentation on how to use [Universal Actions](https://www.alfredapp.com/universal-actions/).

<img src="https://i.imgur.com/q0vKXzT.gif" alt="Conversion of CSS via universal command" width=60%>

## For Theme Designers: Cheat Sheets
**`oc`: Quickly Access Various Cheat Sheets for designing themes in Obsidian.**
- The cheatsheets will be opened via the macOS Quick Look feature, so you can simply close them by pressing `space`.

<img src="https://i.imgur.com/nVT687p.png" alt="Cheat Sheets" width=30%>
