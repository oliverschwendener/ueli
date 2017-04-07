# electronizr


## An 'alt+space' launcher for Windows
This is an 'alt+space' launcher for Windows because I thought the default Windows 10 search function doesn't always do what I want.


![example-image](img/color-themes/osc-dark-blue.png)


## Table of Contents
* [Quick Tutorial](#quick-tutorial)
* [Installation](#installation)
* [Features](#features)
* [Customization](#customization)
* [Color Themes](#color-themes)
* [electronizr specific commands](#electronizr-specific-commands)
* [Planned Features](#planned-features)


## Quick Tutorial
* Hit `alt + space` to show/hide the main program
* Start typing a program name you're looking for
* Hit enter to launch the highlighted program 
* Use the arrow keys to scroll through the search result


## Installation
### Download
You can download the latest version [here](http://electronizr.oliverschwendener.ch)


### Manual Installation
1. Install [NodeJS](https://nodejs.org/)
2. Install [Yarn](https://yarnpkg.com/)
3. Clone Repo or Download ZIP
4. Run [build](#build) script
5. Your application is now in the `dist/` folder
6. Create a shortcut to `electronizr.exe` in the windows startup folder (`C:\Users\<your-username>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`) to run the application on windows logon 


## Features

### Search for programs

* Start typing a program name
* Use arrow keys to scroll up and down
* Hit `Enter` to open the selected program
* Hit `Ctrl+O` to open the selected programs file location

### Custom shortcuts

* You can set up custom shortcuts with a `Shortcut` and `Path`
    * For Example: if the Shortcut is `vsc` and the Path is `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Visual Studio Code\Visual Studio Code.lnk` you can start Visual Studio Code just by entering `vsc`
* You can set up your custom shortcuts with `ezr:config`

### Open URLs with your default web browser

* Start typing a URL
* Hit `Enter` to open the URL in your default web browser

### Use web search engines

* Type `g?<your-search>` to search something with Google's web search engine
* You can set up your web search engines with `ezr:config`

### Execute command line tools

* Start a command line tool with the `>` prefix
    * For example: `>ipconfig /all`
* You can see only the output of the command line tool (stdout)

### Browse local files

* You can browse local files by entering a filepath
    * For example: `C:\Users`
* Hit `Enter` to open file or folder
* Hit `Tab` for autocompletion
* Hit `Ctrl+Space` to preview a file or folder


## Customization
You can customize your application with 'ezr:config'. All Settings, customization and user history are stored in the `~/ezr_config.json` file. If there is no config file run the application once, then it should create one.

### Default configuration

``` json
{
    "keyboardShortcut": "alt+space",
    "size": {
        "width": 960,
        "height": 600
    },
    "zoomFactor": 1,
    "fullscreen": false,
    "colorTheme": "osc-dark-blue",
    "folders": [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
        "C:\\Users\\<your-username>\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu",
        "C:\\Users\\<your-username>\\Desktop"
    ],
    "webSearches": [
        {
            "name": "Google",
            "prefix": "g",
            "url": "https://google.com/search?q=",
            "icon": "fa fa-google"
        }
    ],
    "customShortcuts": [],
    "favorites": [],
    "hideStatusBar": true
}
```

### Options

* `keyboardShortcut` String - Keyboard shortcut to show/hide electronizr. Default is `alt+space`.
    * Available keyboard shortcuts:
        * 'alt+space'
        * 'shift+space'
* `size` Object - Defines the window size.
    * `width` Integer - Window's width in pixels. Default is `960`.
    * `height` Integer - Window's height in pixels. Default is `600`.
* `zoomFactor` Integer - Window's zoom factor, 1 represents 100%. Default is `1`.
* `fullscreen` Boolean - Whether the window should show in fullscreen. Default is `false`.
* `colorTheme` String - Sets the color theme to one of the [available color themes](#color-themes). Default is `osc-dark-blue`.
* `folders` String[] - A List of the folders you want to search. It's recommended not to add a folder with a lot of files because that would slow down the search function drastically. Default are the `Start Menu` and `Desktop` folders.
* `webSearches` Array of webSearch Objects - A List of custom web search engines. Default is the `Google` web search.
    * `webSearch` Object - Defines a custom web search engine
        * `name` String - Represents the displayed name of your search engine.
        * `prefix` String - Represents the prefix for your search engine. For example if the prefix is `g` you can type in `g?<your-search>` to search.
        * `url` String - Represents the url for the search engine. For example Google's url for the search engine is `https://google.com/search?q=<your-search>`.
        * `icon` String (optional) - Represents a font-awesome icon which appears for your custom search engine. For example the [Google icon](http://fontawesome.io/icon/google/) is `fa fa-google`.
* `customShortcuts` Array of customShortcut Objects - A List of custom shortcuts.
    * `customShortcut` Object - Defines a custom shortcut.
        * `shortCut`: String - Represents the keyword for the shortcut. For example `vsc`.
        * `path`: String - Represents the path to the shortcut. For Example `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Visual Studio Code\Visual Studio Code.lnk`
* `favorites` String[] - This is where the applications stores your most used applications. You don't have to modify this.
* `hideStatusBar` Boolean - Whether to hide/show the status bar at the bottom of the window. Default is `true`.

## Color Themes
![all-color-themes](img/color-themes/all-color-themes.png)

* Available color themes:
    * `osc-dark-blue`
    * `osc-dark-green`
    * `atom-one-dark`
    * `dracula`
    * `osc-light-blue`
    * `osc-light-green`


## electronizr specific commands
|Command|Description|
|---|---|
|ezr:config|Open config file|
|ezr:reload|Reload electronizr|
|ezr:reset|Resets the user history|
|ezr:exit|Exit the application|


## Planned Features
* More color themes
* Installer / Prebuilt Downloads
* Access Control Panel items


## Development

### Requirements
* [Git](https://git-scm.com/)
* [NodeJS](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)

### Set up

``` bash
$ git clone https://github.com/oliverschwendener/electronizr?
$ cd electronizr
$ yarn install
```

### Run

``` bash
$ gulp watch
$ yarn start
```
**Note**: the gulp task watches your Javascript and CSS files and runs the associated gulp task if there is any change.

### Build

```
$ yarn build
```
**Note**: the default output location for the build is `dist/`.


## License
Copyright (c) Oliver Schwendener. All rights reserved.

Licensed under the [MIT](LICENSE) License