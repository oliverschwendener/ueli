# electronizr

## An 'alt+space' launcher for Windows
This is an 'alt+space' launcher for Windows because I thought the default Windows 10 search function doesn't always do what I want.

![example-image](https://raw.githubusercontent.com/oliverschwendener/electronizr/master/img/example.png)

## Table of Contents
* [Quick Tutorial](#quick-tutorial)
* [Installation](#installation)
* [Features](#features)
* [Default Settings](#default-settings)
* [Customization](#customization)
* [Color Themes](#color-themes)

## Quick Tutorial
* Hit `alt + space` to show/hide the main program
* Start typing a program name you're looking for
* Hit enter to launch the highlighted program 
* Use tab/shift+tab to scroll through the search result

## Installation
1. Install [Node](https://nodejs.org/en/)
2. Clone Repo or Download ZIP
3. Install npm packages
    * `$ npm install`
4. Run gulp build task
    * `$ gulp build`
5. Run build script
    * `$ npm run build`
6. Your application is now in the `dist/` folder
7. Create a shortcut to `electronizr.exe` in the windows startup folder (`C:\Users\<your-username>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`) to run the application on windows logon    

## Features
* Search while typing
* Launch a program by hitting `Enter`
* Launch console programs with a `>` prefix
    * e.g. `>ipconfig /all`
* Open a web URL with your default web browser
    * e.g. `google.com`
* Use Google search function with a `g:` prefix
    * e.g. `g:how can i exit vi`
* Use your own web search engines
* Open Folder or Files with entering a file path
    * e.g. `C:\temp` or `C:\temp\myphoto.jpg`
* Current color themes:
    * One Dark (Atom)
    * More to come...

## Default Settings
``` json
{
    "folders": [
        "C:\\ProgramData\\Microsoft\\Start Menu",
        "C:\\Users\\<your-username>\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu",
        "C:\\Users\\<your-usernam>\\Desktop"
    ],
    "webSearches": [
        {
            "name": "Google",
            "prefix": "g",
            "url": "google.com/search?q="
        }
    ],
    "customShortcuts": []
}
```

## Customization
All Settings are stored in the `ezr_config.json` file in your home folder.
If there is no config file run the application once, it should create one.

* Options:
    * folders:
        * Example:
        ``` json
        [
            C:\\ProgramData\\Microsoft\\Windows\\Start Menu,
            C:\\Users\\<your-username>\\Downloads,
            C:\\Users\\<your-username>\\Desktop
        ]
        ```
    * webSearches:
        * Example: 
        ``` json
        [
            {
                "name": "Vimeo",
                "prefix": "v",
                "url": "https://vimeo.com/search?q="
            }
        ]
        ```

    * customCommands:
        * Example:
        ``` json
        [
            {
                "code": "c",
                "path": "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk"
            }
        ]
        ```

## Color Themes
### One Dark (Atom)
![color-theme-dark](https://raw.githubusercontent.com/oliverschwendener/random/master/electronizr/img/color-themes/one-dark.png)

There are more to come in the future...

## electronizr specific commands
|Command|Description|
|---|---|
|ezr:reload|Reload electronizr|
|ezr:config|Open config file|
|exit|Exit the application| 

## Planned Features
* Installer / Prebuilt Downloads
* Favorite Programs will be listed higher in the search result
* More Color themes
* More user customization
    * custom color themes