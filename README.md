# Ueli

Ueli is a cross-platform keystroke launcher.

![Screenshot Dark Windows](docs/example-screenshot.webp)

# Installation

**Please download Ueli only from the Microsoft Store, the Website https://ueli.app, or this repository.**

## Windows

Get the app from the [Microsoft Store](https://www.microsoft.com/store/productId/9PK44N42B2G7?ocid=pdpshare) or install it with winget: `winget install Ueli -s msstore`.

Optionally, you can also manually download and install the app from [here](https://github.com/oliverschwendener/ueli/releases/latest), but note that, due to cost reasons, these binaries are not signed. Windows will prevent you from installing / opening the app.

## macOS

Download and install the app from [here](https://github.com/oliverschwendener/ueli/releases/latest). Note that, due to cost reasons, these binaries are neither signed nor notarized.

> Because Ueli is neither signed nor notarized, macOS will prevent you from installing or opening the app. When you try to launch the app for the first time macOS will block it from opening. You can open the "System Settings", go to "Privacy & Security" and click on "Open anyway", see screenshot.

## Linux

Download and install the app from [here](https://github.com/oliverschwendener/ueli/releases/latest).

# First steps

- When you launch the app for the first time the main window will show up and you can start typing for what you're looking for.
- Use the hotkey "Alt+Space" to show/hide Ueli.
- Use the arrow keys to navigate up and down in the search result list.
- Press "Enter" to launch the selected item.
- Press "Cmd+K" (macOS) or "Ctrl+K" (Windows, Linux) to open the additional actions of the selected search result item and use the arrow keys to navigate up and down in the menu. Press "Enter" to invoke the selected action. Press "Escape" to close the additonal action menu.
- To add a frequently used item to your favorites open the additional actions menu and click on "Add to Favorites". Now this item will appear always first in the search result list. To remove an item from your favorites open the additional actions and click on "Remove from favorites". Alternatively, you can also open the settings and go to "Favorites" to see all favorites. Click on the "x" icon to remove an item from your favorites.
- Press "Cmd+," (macOS) or "Ctrl+," (Windows, Linux) or click on the "Settings" button to open the settings. Here you can configure Ueli to your liking.
- To browse the extensions click on "Extensions" in the left navigation. Toggle the switch to enable/disable an extension. As soon as an extension is enabled an additional item will appear in the left navigation where you will find the settings for that specific extension. You'll find more info about the extensions [here](https://github.com/oliverschwendener/ueli/wiki/Extensions).

# Debugging

If something does not work as expected, go to "Settings" and click on "Debug".

Here you might find some logs that help find the issue.

![image](https://github.com/user-attachments/assets/d850cb71-6588-4f39-8cfc-f042beb94f1e)

# Settings

⚠️ Under construction...

# Extensions

- [Appearance Switcher](docs/Extensions/AppearanceSwitcher/README.md)
- [Application Search](docs/Extensions/ApplicationSearch/README.md)
- [Base64 Conversion](docs/Extensions/Base64Conversion/README.md)
- [Browser Bookmarks](docs/Extensions/BrowserBookmarks/README.md)
- [Calculator](docs/Extensions/Calculator/README.md)
- [Color Converter](docs/Extensions/ColorConverter/README.md)
- [Currency Conversion](docs/Extensions/CurrencyConversion/README.md)
- [Custom Web Search](docs/Extensions/CustomWebSearch/README.md)
- [DeepL Translator](docs/Extensions/DeeplTranslator/README.md)
- [File Search](docs/Extensions/FileSearch/README.md)
- [JetBrains Toolbox](docs/Extensions/JetBrainsToolbox/README.md)
- [Password Generator](docs/Extensions/PasswordGenerator/README.md)
- [Rowland Text Editor](docs/Extensions/RowlandTextEditor/README.md)
- [Simple File Search](docs/Extensions/SimpleFileSearch/README.md)
- [System Commands](docs/Extensions/SystemCommands/README.md)
- [System Settings](docs/Extensions/SystemSettings/README.md)
- [Terminal Launcher](docs/Extensions/TerminalLauncher/README.md)
- [Ueli Commands](docs/Extensions/UeliCommands/README.md)
- [UUID / GUID Generator](docs/Extensions/UuidGenerator/README.md)
- [Visual Studio Code](docs/Extensions/VSCode/README.md)
- [Web Search](docs/Extensions/WebSearch/README.md)
- [Windows Control Panel](docs/Extensions/WindowsControlPanel/README.md)

# Known issues

## Linux

Global hotkeys may not work under Wayland sessions. As a workaround, bind a custom shortcut in your system settings to call `ueli` to show and focus the main window, or `ueli --toggle` to toggle the main window.

# Development

Please read the [contribution guidelines](CONTRIBUTING.md) first.

## Requirements

- Node.js 24: https://nodejs.org/en
- Make sure you have [commit signing](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) enabled
- Optional: if you're using Visual Studio Code we recommend installing the recommended extensions

## Setup

- Install dependencies

    ```
    $ npm install
    ```

## Running the app

- Run app in dev mode

    ```
    $ npm run dev
    ```

## Debugging

If you're using Visual Studio Code, you can start the debugger for the main process, see screenshot:
![vscode-debugging](https://github.com/oliverschwendener/ueli/assets/15727229/b2a6cbc3-ed70-4878-bbc1-4c840b8dd3ea)

## Quality checks

- Check formatting

    ```
    $ npm run prettier:check
    ```

- Format the code

    ```
    $ npm run prettier:write
    ```

- Lint files

    ```
    $ npm run lint
    ```

- Perform typecheck

    ```
    $ npm run typecheck
    ```

- Run tests

    ```
    $ npm run test
    ```

## Build and package the app

- Build

    ```
    $ npm run build
    ```

- Package
    ```
    $ npm run package
    ```
