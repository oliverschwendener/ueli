# VSCode Extension

This extension allows you to open recently edited projects and files in vscode.

![Example](example.png)

## Settings

- Prefix: the prefix that triggers the vscode extension.
- Command: The command that the extension will invoke to open vscode and pass it the recent item.
- Show file/folder path: append the path to each search result name.
- Use legacy recents query: read recents only from the user profile `state.vscdb` (`recently.opened` / `history.recentlyOpenedPathsList`). Leave off to also read local recents from shared storage on VS Code 1.118+.

## About this extension

Author: [Ethan Conneely](https://github.com/IrishBruse)

Recents are read from VS Code's SQLite state databases:

- **Local folders/files** (VS Code 1.118+): `~/.vscode-shared/sharedStorage/state.vscdb` (`history.recentlyOpenedPathsList`)
- **Remote workspaces** (GitHub, Codespaces, etc.): `~/.config/Code/User/globalStorage/state.vscdb` (`recently.opened`)
- **Older VS Code**: user `state.vscdb` (`history.recentlyOpenedPathsList` or `recently.opened`)

Supported operating systems:

- Windows
- macOS
- Linux
