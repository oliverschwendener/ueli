import {ExecutionPlugin} from "../../execution-plugin";
import {PluginType} from "../../plugin-type";
import {SearchResultItem} from "../../../common/search-result-item";
import {TranslationSet} from "../../../common/translation/translation-set";
import {UserConfigOptions} from "../../../common/config/user-config-options";
import {ReminderOptions} from "../../../common/config/reminder-options";
import {defaultReminderIcon} from "../../../common/icon/default-icons";
import {join} from "path";
import {parseReminder} from "./reminder-parser";
import {scheduleJob} from 'node-schedule';

import {Notification} from "electron";


export class ReminderPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.Reminder;
    private config: ReminderOptions;

    private translationSet: TranslationSet;

    constructor(config: ReminderOptions, translationSet: TranslationSet) {
        this.config = config;
        this.translationSet = translationSet;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        if ( userInput.startsWith(this.config.prefix) && userInput.length > this.config.prefix.length) {
            const command = userInput.replace(this.config.prefix, '').trim();
            try {
                const task = parseReminder(command);
                return task != null;
            } catch (e) {
                return false
            }
        }else{
            return false;
        }

    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const command = userInput.replace(this.config.prefix, '').trim();
            const task = parseReminder(command);
            if (task != null) {
                const result: SearchResultItem = {
                    description: `Remind me to ${task.what}`,
                    executionArgument: `${command}`,
                    hideMainWindowAfterExecution: true,
                    icon: defaultReminderIcon,
                    name: `${this.translationSet.reminder}: ${command}`,
                    originPluginType: this.pluginType,
                    searchable: [],
                };
                resolve([result]);
            } else {
                reject()
            }

        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return new Promise(resolve => {
            const task = parseReminder(searchResultItem.executionArgument);
            if (task!=null){
                scheduleJob(task.when, () => {
                    new Notification( {
                        title:"UELI",
                        body:  task.what,
                        icon:join(__dirname,'../img/icons/win/icon-transparent.ico'),
                    }).show();
                })
                resolve()
            }

        })

    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.reminderOptions;
            this.translationSet = translationSet;
            resolve();
        });

    }


}
