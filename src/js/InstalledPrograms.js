import fs from 'fs';
import path from 'path';
import os from 'os';
import FileSystemSearch from './FileSystemSearch';
import Helpers from './Helpers';
import CustomShortcuts from './CustomShortcuts';
import ConfigHelper from './ConfigHelper';
import Favorites from './Favorites';

export default class InstalledPrograms {
    constructor() {
        this.fsSearch = new FileSystemSearch();
        this.helpers = new Helpers();
        this.customShortcuts = new CustomShortcuts().getCustomShortcuts();
        this.folders = this.getFoldersToSearch();
        this.programs = this.getAllPrograms();

        for (let folder of this.folders) {
            fs.watch(folder, { encoding: 'buffer' }, (eventType, fileName) => {
                this.programs = this.getAllPrograms();
            });
        }
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
                    fileExt: path.extname(customShortcut.path) === '.lnk' ? '' : fileExtension,
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

        // Show Items of History at the top
        let historyItems = new Favorites().getItems();
        for (let item of searchResult) {
            for (let historyItem of historyItems) {
                if (item.path === historyItem.path)
                    item.weight = item.weight - historyItem.counter;
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
        let userConfig = new ConfigHelper().getConfig();

        if (userConfig.folders !== undefined)
            return userConfig.folders;

        return [
            'C:\\ProgramData\\Microsoft\\Windows\\Start Menu',
            `${os.homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
            `${os.homedir()}\\Desktop`
        ]
    }

    isValid(input) {
        if (input.replace(' ', '').length === 0)
            return false;

        if (this.getSearchResult(input).length > 0)
            return true;

        return false;
    }

    getIcon() {
        return 'fa fa-window-maximize';
    }

    getInfoMessage(input) {
        let programs = this.getSearchResult(input);
        let result = '';
        for (let program of programs)
            result += `<div id="search-result-${program.number}">
                            <p class="result-name">${program.name}<span class="file-extension">${program.fileExt}</span></p>
                            <p class="result-description">${program.path}</p>
                        </div>`;

        return result;
    }
}