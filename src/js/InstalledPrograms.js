'use strict';

import fs from 'fs';
import path from 'path';
import os from 'os';
import FileSystemSearch from './FileSystemSearch.js';
import Helpers from './Helpers.js';
import CustomShortcuts from './CustomShortcuts.js';
import Constants from './Constants.js';

export default class InstalledPrograms {
    constructor() {
        this.fsSearch = new FileSystemSearch();
        this.helpers = new Helpers();
        this.customShortcuts = new CustomShortcuts().getCustomShortcuts();
        this.configFilePath = new Constants().getConfigFilePath();

        this.folders = this.getFoldersToSearch();
        this.programs = this.getAllPrograms();
    }

    getSearchResult(input) {
        let searchResult = [];
        let maxResultLength = 5;

        // Add CustomShortCuts
        for (let customShortcut of this.customShortcuts) {
            if (customShortcut.code === input) {
                let fileExtension = path.extname(customShortcut.path);
                let app = {
                    name: path.basename(customShortcut.path).replace(fileExtension, ''),
                    fileExt: path.extname(customShortcut.path),
                    path: customShortcut.path,
                    weight: 0
                };
                searchResult.push(app);
            }
        }

        // Add Weight to Programs
        for (let program of this.programs) {
            let fileNameWithExtension = path.basename(program.path).toLowerCase();
            if (this.helpers.stringContainsSubstring(fileNameWithExtension, input.toLowerCase())) {
                program.weight = this.helpers.getWeight(fileNameWithExtension, input.toLowerCase());
                searchResult.push(program);
            }
        }

        // Sort Programs by weight
        let sortedResult = searchResult.sort((a, b) => {
            if (a.weight > b.weight) return 1;
            if (a.weight < b.weight) return -1;
            return 0;
        });

        // Number Result
        for (let i = 0; i < sortedResult.length; i++) {
            sortedResult[i].number = i;
        }

        // Take only max 5 items
        if (sortedResult.length > maxResultLength) {
            let result = [];

            for (let i = 0; i < maxResultLength; i++)
                result.push(sortedResult[i]);

            return result;
        }
        return sortedResult;
    }

    getAllPrograms() {
        let result = [];
        let allShortCutFiles = this.fsSearch.getFilesFromDirectoriesRecursivelyByFileExtension(this.folders, '*');

        for (let shortcut of allShortCutFiles) {
            let fileExtension = path.extname(shortcut);
            let program = {
                name: path.basename(shortcut).replace(fileExtension, ''),
                fileExt: path.extname(shortcut) === '.lnk' ? '' : fileExtension,
                path: shortcut
            }

            result.push(program);
        }

        return result;
    }

    getAll() {
        return this.programs;
    }

    getFoldersToSearch() {
        let userConfig = {};

        if (fs.existsSync(this.configFilePath)) {
            let fileContent = fs.readFileSync(this.configFilePath);
            userConfig = JSON.parse(fileContent);
        }

        if (userConfig.folders !== undefined)
            return userConfig.folders;

        return [
            'C:\\ProgramData\\Microsoft\\Windows\\Start Menu',
            `${os.homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
            `${os.homedir()}\\Desktop`
        ]
    }

    isValid(input) {
        if(this.getSearchResult(input).length > 0)
            return true;

        return false;
    }

    getInfoMessage(input) {
        let programs = this.getSearchResult(input);
        let result = '';
        for (let program of programs)
            result += `<div id="search-result-${program.number}">
                            <p class="app-name">${program.name}<span class="app-file-extension">${program.fileExt}</span></p>
                            <p class="app-path">${program.path}</p>
                        </div>`;

        return result;
    }
}