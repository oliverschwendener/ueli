'use strict';

import path from 'path';
import os from 'os';
import levenshtein from 'fast-levenshtein';
import FileSystemSearch from './FileSystemSearch.js';
import Helpers from './Helpers.js';
import CustomShortcuts from './CustomShortcuts.js';

export default class InstalledPrograms {
    constructor() {
        this.fsSearch = new FileSystemSearch();
        this.helpers = new Helpers();
        this.customShortcuts = new CustomShortcuts().getCustomShortcuts();

        this.folders = [
            'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs',
            `${os.homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs`
        ]

        this.programs = this.getAllPrograms();
    }

    getSearchResult(input) {
        let searchResult = [];
        let maxResultLength = 5;

        // Add CustomShortCuts
        for(let customShortcut of this.customShortcuts) {
            if(customShortcut.code === input) {
                let app = {
                    name: path.basename(customShortcut.path).replace('.lnk', ''),
                    path: customShortcut.path,
                    weight: 0
                };
                searchResult.push(app);
            }
        }

        // Add Weight to Programs
        for(let program of this.programs) {
            if(this.helpers.stringContainsSubstring(program.name.toLowerCase(), input.toLowerCase())) {
                program.weight = levenshtein.get(program.name.toLowerCase().replace(' ', ''), input.toLowerCase().replace(' ', ''));
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
        for(let i = 0; i < sortedResult.length; i++) {
            sortedResult[i].number = i;
        }

        // Take only max 5 items
        if(sortedResult.length > maxResultLength) {
            let result = [];

            for(let i = 0; i < maxResultLength; i++)
                result.push(sortedResult[i]);

            return result;
        }
        return sortedResult;
    }

    getAllPrograms() {
        let result = [];
        let allShortCutFiles = this.fsSearch.getFilesFromDirectoriesRecursivelyByFileExtension(this.folders, '.lnk');

        for (let shortcut of allShortCutFiles) {
            let program = {
                name: path.basename(shortcut).replace('.lnk', ''),
                path: shortcut
            }

            result.push(program);
        }

        return result;
    }

    getAll() {
        return this.programs;
    }
}