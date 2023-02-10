import ElectronStore from "electron-store";
import { NotesOptions } from "../../../common/config/notes-options";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { defaultLoremIpsumIcon } from "../../../common/icon/default-icons";
import { SearchResultItem } from "../../../common/search-result-item";
// import { TranslationSet } from "../../../common/translation/translation-set";
import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";

const noteStore = new ElectronStore({
    name: "notes",
    schema: {notes: {
        type: 'array',
        items: {
            type: 'string',
        },
    }},
});
if(!noteStore.has('notes') || !Array.isArray(noteStore.get('notes'))) {
    noteStore.set('notes', []);
}


function addNote(note: string) {
    const oldNotes: string[] = noteStore.get('notes') as string[];
    noteStore.set('notes', [...oldNotes, note]);
}
function deleteNote(note: string) {
    const oldNotes: string[] = noteStore.get('notes') as string[];
    noteStore.set('notes', oldNotes.filter((n: string) => n !== note))
}


export class NotesPlugin implements ExecutionPlugin {
    public pluginType = PluginType.NotesPlugin;

    constructor(
        private config: NotesOptions,
        // private translationSet: TranslationSet,
        private clipboardCopier: (value: string) => Promise<void>,
    ) {}

    public isValidUserInput(userInput: string): boolean {
        return (userInput.startsWith(this.config.prefixWrite) && userInput.trim().length > this.config.prefixWrite.length) ||
                userInput.startsWith(this.config.prefixRead);
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            if(userInput.startsWith(this.config.prefixWrite)) {
                const note = userInput.replace(this.config.prefixWrite, "").trim();
                const result: SearchResultItem = {
                    description: "Press enter to add new note",
                    executionArgument: "add:" + note,
                    hideMainWindowAfterExecution: true,
                    icon: defaultLoremIpsumIcon,
                    name: "New Note: " + note,
                    originPluginType: this.pluginType,
                    searchable: [],
                };
                resolve([result]);
            } else if(userInput.startsWith(this.config.prefixRead)) {
                const search = userInput.replace(this.config.prefixRead, "").trim();
                const notes = (noteStore.get('notes') as string[]).filter((note: string) => note.includes(search));
                const results: SearchResultItem[] = [];
                notes.forEach(note => {
                    results.push({
                        description: "Press enter to copy to clipboard or Shift+Enter to delete.",
                        executionArgument: "get:" + note,
                        hideMainWindowAfterExecution: true,
                        icon: defaultLoremIpsumIcon,
                        name: note,
                        originPluginType: this.pluginType,
                        searchable: [],
                    })
                })
                resolve(results)
            } else resolve([])
            
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        if(searchResultItem.executionArgument.startsWith("add:")) {
            const note = searchResultItem.executionArgument.replace("add:", "");
            addNote(note);
        } else if(searchResultItem.executionArgument.startsWith("get:")) {
            const note = searchResultItem.executionArgument.replace("get:", "");
            if(privileged) {
                deleteNote(note);
            } else {
                this.clipboardCopier(note)
            }
        }

        return Promise.resolve();
    }

    public updateConfig(updatedConfig: UserConfigOptions, /*translationSet: TranslationSet*/): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.notesOptions;
            // this.translationSet = translationSet;
            resolve();
        });
    }
}
