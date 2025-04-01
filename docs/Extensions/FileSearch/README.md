# File Search

This extension allows you to search for files and folders on your computer. Search for "Search files" and press enter to open the file search view. Enter a search term to find files and folders. Press enter to open the selected file.

The File Search extension uses `mdfind` (on macOS) and Everything (on Windows) under the hood to do the file search.

![example](example.png)

## Requirements

### Windows

Make sure you have Everything and the Everything Command-line Interface installed and running.

#### Setup guide

1. Download Everything and the Everything Command-line Interface from here https://www.voidtools.com/downloads/

2. Put all together into a directory of your choice (e.g. C:\Program Files\Everything)

3. Start Everything and make sure it starts with Windows (Everything settings under General)

4. Open Ueli Settings and activate the File Search extension under the Extensions

5. Enter the Everything CLI Path from above (e.g. C:\Program Files\Everything\es.exe)

6. Open Ueli and search for "Search files", press Enter and type what you are searching for.

### macOS

On macOS you don't have to install any third-party tools. Just make sure the spotlight indexing service is up-and-running.

## Settings

- Max search result items: the maximum number of search result items that are shown. The lower this number the faster the search.
- (Windows) Everything CLI file path: the file path to the Everything Command-line Interface `es.exe`.

## About this extension

Author: [Oliver Schwendener](https://github.com/oliverschwendener)

Supported operating systems:

- Windows
- macOS
