---
name: geogebra-manual
description: "Use the official GeoGebra manual/reference (English) to answer questions about GeoGebra tools, commands, input bar usage, views (Graphics/3D/CAS/Spreadsheet), and scripting (GGBScript/JavaScript). Trigger when a user asks for manual-based guidance, definitions, or exact usage instructions, or when you need to cite the official manual/reference content."
---


# GeoGebra Manual (English)

## GeoGebra CLI – Brief Introduction

GeoGebra is an interactive mathematics software mainly designed for graphical use.  
There is no official standalone command-line interface (CLI), but GeoGebra can be launched and controlled in limited ways from the terminal.

Typical CLI usage includes:
- Starting GeoGebra from the command line
- Opening `.ggb` files via terminal commands
- Automating exports by scripting a headless browser with GeoGebra Web

GeoGebra CLI-style workflows are commonly used in automation, CI pipelines, or teaching setups where graphical interaction is not required.


## GeoGebra CLI – Installation Guide

GeoGebra is mainly a graphical application. “CLI usage” usually means installing GeoGebra and launching it from the terminal or opening `.ggb` files via command line.

---

### Install GeoGebra

#### Linux (Flatpak – recommended)
```bash
sudo apt install -y flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install -y flathub org.geogebra.GeoGebra
````

Run:

```bash
flatpak run org.geogebra.GeoGebra
```

---

#### macOS

Using Homebrew:

```bash
brew install --cask geogebra
```

Run:

```bash
open -a "GeoGebra Classic"
```

---

#### Windows

Using winget:

```powershell
winget install GeoGebra.Classic
```

Run:

```powershell
start "" "GeoGebra Classic"
```

---

## Overview
Use the official GeoGebra manual/reference content stored as Markdown mirror files. Do not summarize unless the user asks; quote or point to the exact manual sections as needed.

## How to use this skill
1. Identify the relevant manual section(s) based on the user request.
2. Open the corresponding Markdown file(s) under `references/manual/`.
3. Respond using the manual content; keep wording as close as possible when asked for exact definitions.

## Manual mirror layout
The manual/reference is mirrored under:
- `references/manual/docs/manual/en/`
- `references/manual/docs/reference/en/`

Each HTML page is converted to a Markdown file at the same relative path. Example:
- `https://geogebra.github.io/docs/manual/en/Input_Bar/`
  -> `references/manual/docs/manual/en/Input_Bar/index.md`

## Notes
- The mirror includes all pages listed in the official site sitemap for `manual/en` and `reference/en`.
- If a page is missing, locate its URL in `references/urls.json` and verify its output path.
