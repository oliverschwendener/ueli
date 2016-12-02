# electronizr

## Table of Contents
* [Demo](#demo)
* [Quick Tutorial](#quick-tutorial)
* [Installation](#installation)
* [Features](#features)
* [Color Themes](#color-themes)
* [Planned Features](#planned-features)
* [Current Bugs](#current-bugs)

## An 'alt+space' launcher for Windows

This is an 'alt+space' launcher for Windows because I thought the default Windows 10 search function doesn't always do what I want.

## Demo
![demo-video](https://raw.githubusercontent.com/oliverschwendener/random/master/electronizr/img/demo/ezr-demo.gif)

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
* Launch shell commands with a `>` prefix
    * e.g. `>ipconfig /all`
* Open a web URL with your default web browser
    * e.g. `google.com`
* Use Google search function with a `g:` prefix
    * e.g. `g:how can i exit vi`
* Use Wikipedia search function with a `wiki:` prefix
    * e.g. `wiki:nissan gtr`
* Open Folder or Files with entering a file path
    * e.g. `C:\temp` or `C:\temp\myphoto.jpg`
* Different color themes:
    * Dark
    * Light
    * 'Default Windows 10 like'

## Color Themes
### Dark
![color-theme-dark](https://raw.githubusercontent.com/oliverschwendener/random/master/electronizr/img/color-themes/dark.png)

### Light
![color-theme-light](https://raw.githubusercontent.com/oliverschwendener/random/master/electronizr/img/color-themes/light.png)

### 'Default Windows 10 like'
![color-theme-win10](https://raw.githubusercontent.com/oliverschwendener/random/master/electronizr/img/color-themes/win10.png)

## electronizr specific commands
|Command|Description|
|---|---|
|ezr:reload|Rescan of all Startmenu folders|
|ezr:dark-theme|Load dark theme|
|ezr:light-theme|Load light theme|
|ezr:win10-theme|Load Windows 10 theme|
|exit|Exit the application| 

## Planned Features
* Execution for all shell commands
    * Output will be displayed in the main application window
* Favorite Programs will be listed higher in the search result
* More user customization
    * custom color theme
    * custom folders to search + fileextensions
    * custom search engines
    * custom shortcuts

## Current Bugs
* Changing color theme sometimes messes up the styling
    * If that happens you have to exit the application and start it over
* Shell commands are limited to the Windows 10 default commandline tools like `ping`, `ipconfig` etc.