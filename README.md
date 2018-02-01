# electron-typescript-quickstart

[![travis-ci](https://travis-ci.org/oliverschwendener/electron-typescript-quickstart.svg?branch=master)](https://travis-ci.org/oliverschwendener/electron-typescript-quickstart)
[![appveyor](https://ci.appveyor.com/api/projects/status/qxj5pnbjke6f5pcj?svg=true)](https://ci.appveyor.com/project/oliverschwendener/electron-typescript-quickstart)

This is a quickstart repo for electron with typescript and sass including launch configurations for vscode.


## Requirements

* [Node](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/lang/en/)
* [Visual Studio Code](https://code.visualstudio.com/) (Recommended)


## Setup

Install dependencies

```
$ yarn install
```

Transpile Typescript & SASS files

```
$ yarn build
```

Start application

```
$ yarn start
```

## Development

Start watch task for Typescript files

```
$ yarn tsc:watch
```

Start watch task for SASS files

```
$ yarn gulp:watch
```

Run unit tests

```
$ yarn test
```

### Debugging in Visual Studio Code

There are 3 launch configurations for Visual Studio Code which you can find here (all stored in `.vscode/launch.json`):

![launch-configurations-vscode](doc/images/launch-configurations.png)

* Electron Main
    * Starts electron in debug mode for the main process
* Electron Renderer
    * Starts electron in debug mode for the renderer process
    * [Debugger for Chrome extension](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) is required
* Mocha Tests
    * Runs unit tests in debug mode


## Distribution

Package for the current operating system

```
$ yarn package
```


## Folder structure

```
dist/               -> output folder for packaged apps
img/                -> static image files (e.g. app icons)
src/js/             -> generated js files for main process
src/ts/             -> typescript files for main process
src/styles/css      -> generated css files
src/styles/scss     -> sass files
src/renderer.js     -> entry point for js executed by the renderer
src/main.html       -> loaded by the browser window
tests/              -> typescript tests
```
