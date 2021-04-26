import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { join } from "path";
import { defaultGeneralOptions } from "../../common/config/general-options";
import { GlobalHotKeyModifier } from "../../common/global-hot-key/global-hot-key-modifier";
import { GlobalHotKeyKey } from "../../common/global-hot-key/global-hot-key-key";
import { Language } from "../../common/translation/language";
import { getFolderPath, getFilePath } from "../dialogs";
import { NotificationType } from "../../common/notification-type";
import { TranslationSet } from "../../common/translation/translation-set";
import { FileHelpers } from "../../common/helpers/file-helpers";
import { isValidJson, mergeUserConfigWithDefault } from "../../common/helpers/config-helpers";
import { defaultUserConfigOptions } from "../../common/config/user-config-options";
import { GeneralSettings } from "./general-settings";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { UpdateCheckResult } from "../../common/update-check-result";
import { isDev } from "../../common/is-dev";
import { getCurrentOperatingSystem } from "../../common/helpers/operating-system-helpers";
import { platform } from "os";
import { version } from "../../../package.json";
import { deepCopy } from "../../common/helpers/object-helpers";
import { OperatingSystem } from "../../common/operating-system";

const operatingSystem = getCurrentOperatingSystem(platform());
const appIsInDevelopment = isDev(process.execPath);

interface UpdateStatus {
    checking: boolean;
    downloading: boolean;
    errorOnUpdateCheck: boolean;
    latestVersionRunning: boolean;
    updateAvailable: boolean;
}

const initialUpdateStatus: UpdateStatus = {
    checking: true,
    downloading: false,
    errorOnUpdateCheck: false,
    latestVersionRunning: false,
    updateAvailable: false,
};

const appInfo = {
    electron: process.versions.electron,
    node: process.versions.node,
    ueli: version,
    v8: process.versions.v8,
};

export const generalSettingsComponent = Vue.extend({
    data() {
        return {
            appInfo,
            appIsInDevelopment,
            availableLanguages: Object.values(Language).map((language) => language),
            dropdownVisible: false,
            globalHotKeyKeys: Object.values(GlobalHotKeyKey).map((key) => key),
            globalHotKeyModifiers: Object.values(GlobalHotKeyModifier).map((modifier) => modifier),
            settingName: GeneralSettings.General,
            updateStatus: deepCopy(initialUpdateStatus),
            visible: false,
        };
    },
    methods: {
        clearExecutionLog() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    vueEventDispatcher.$emit(VueEventChannels.clearExecutionLogConfirmed);
                },
                message: translations.generalSettingsClearExecutionLogWarning,
                modalTitle: translations.clearExecutionLog,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        dropdownTrigger() {
            this.dropdownVisible = !this.dropdownVisible;
        },
        exportCurrentSettings() {
            getFolderPath()
                .then((filePath: string) => {
                    const config: UserConfigOptions = this.config;
                    const translations: TranslationSet = this.translations;
                    const settingsFilePath = join(filePath, "ueli.config.json");
                    FileHelpers.writeFile(settingsFilePath, JSON.stringify(config, undefined, 2))
                        .then(() =>
                            vueEventDispatcher.$emit(
                                VueEventChannels.notification,
                                translations.generalSettingsSuccessfullyExportedSettings,
                                NotificationType.Info,
                            ),
                        )
                        .catch((err) =>
                            vueEventDispatcher.$emit(VueEventChannels.notification, err, NotificationType.Error),
                        );
                })
                .catch((err) => {
                    // do nothing when no folder selected
                });
        },
        getTranslatedGlobalHotKeyModifier(hotkeyModifier: GlobalHotKeyModifier): string {
            const translations: TranslationSet = this.translations;
            switch (hotkeyModifier) {
                case GlobalHotKeyModifier.Alt:
                    return translations.hotkeyModifierAlt;
                case GlobalHotKeyModifier.AltGr:
                    return translations.hotkeyModifierAltGr;
                case GlobalHotKeyModifier.Command:
                    return translations.hotkeyModifierCommand;
                case GlobalHotKeyModifier.Control:
                    return translations.hotkeyModifierControl;
                case GlobalHotKeyModifier.Option:
                    return translations.hotkeyModifierOption;
                case GlobalHotKeyModifier.Shift:
                    return translations.hotkeyModifierShift;
                case GlobalHotKeyModifier.Super:
                    return translations.hotkeyModifierSuper;
                default:
                    return hotkeyModifier;
            }
        },
        getTranslatedGlobalHotKeyKey(hotkeyKey: GlobalHotKeyKey): string {
            const translations: TranslationSet = this.translations;
            switch (hotkeyKey) {
                case GlobalHotKeyKey.Backspace:
                    return translations.hotkeyKeyBackspace;
                case GlobalHotKeyKey.Delete:
                    return translations.hotkeyKeyDelete;
                case GlobalHotKeyKey.Down:
                    return translations.hotkeyKeyDown;
                case GlobalHotKeyKey.End:
                    return translations.hotkeyKeyEnd;
                case GlobalHotKeyKey.Escape:
                    return translations.hotkeyKeyEscape;
                case GlobalHotKeyKey.Home:
                    return translations.hotkeyKeyHome;
                case GlobalHotKeyKey.Insert:
                    return translations.hotkeyKeyInsert;
                case GlobalHotKeyKey.Left:
                    return translations.hotkeyKeyLeft;
                case GlobalHotKeyKey.PageDown:
                    return translations.hotkeyKeyPageDown;
                case GlobalHotKeyKey.PageUp:
                    return translations.hotkeyKeyPageUp;
                case GlobalHotKeyKey.Plus:
                    return translations.hotkeyKeyPlus;
                case GlobalHotKeyKey.Return:
                    return translations.hotkeyKeyReturn;
                case GlobalHotKeyKey.Right:
                    return translations.hotkeyKeyRight;
                case GlobalHotKeyKey.Space:
                    return translations.hotkeyKeySpace;
                case GlobalHotKeyKey.Tab:
                    return translations.hotkeyKeyTab;
                case GlobalHotKeyKey.Up:
                    return translations.hotkeyKeyUp;
                default:
                    return hotkeyKey;
            }
        },
        importSettings() {
            const translations: TranslationSet = this.translations;
            const filter: Electron.FileFilter = {
                extensions: ["json"],
                name: translations.generalSettingsImportFileFilterJsonFiles,
            };
            getFilePath([filter])
                .then((filePath) => {
                    FileHelpers.readFile(filePath)
                        .then((fileContent) => {
                            if (isValidJson(fileContent)) {
                                const userConfig: UserConfigOptions = JSON.parse(fileContent);
                                const config: UserConfigOptions = mergeUserConfigWithDefault(
                                    userConfig,
                                    defaultUserConfigOptions,
                                );
                                this.config = config;
                                this.updateConfig();
                            } else {
                                vueEventDispatcher.$emit(
                                    VueEventChannels.notification,
                                    translations.generalSettingsImportErrorInvalidConfig,
                                    NotificationType.Error,
                                );
                            }
                        })
                        .catch((err) =>
                            vueEventDispatcher.$emit(VueEventChannels.notification, err, NotificationType.Error),
                        )
                        .then(() => (this.dropdownVisible = false));
                })
                .catch((err) => {
                    // do nothing if no file selected
                });
        },
        openDebugLog() {
            vueEventDispatcher.$emit(VueEventChannels.openDebugLogRequested);
        },
        openTempFolder() {
            vueEventDispatcher.$emit(VueEventChannels.openTempFolderRequested);
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.generalOptions = deepCopy(defaultGeneralOptions);
                    this.updateConfig();
                },
                message: translations.generalSettingsResetWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        resetAllSettingsToDefault() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    this.config = deepCopy(defaultUserConfigOptions);
                    this.updateConfig(true);
                    this.dropdownVisible = false;
                },
                message: translations.generalSettingsResetAllSettingsWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Error,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        updateConfig(needsIndexRefresh?: boolean) {
            const config: UserConfigOptions = this.config;
            if (config.generalOptions.rememberWindowPosition) {
                config.generalOptions.showAlwaysOnPrimaryDisplay = false;
            }
            if (config.generalOptions.rescanIntervalInSeconds < 10) {
                config.generalOptions.rescanIntervalInSeconds = 10;
            }
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config, needsIndexRefresh);
        },
        checkForUpdate() {
            vueEventDispatcher.$emit(VueEventChannels.checkForUpdate);
        },
        downloadUpdate() {
            vueEventDispatcher.$emit(VueEventChannels.downloadUpdate);
            if (operatingSystem === OperatingSystem.Windows) {
                const updateStatus: UpdateStatus = this.updateStatus;
                updateStatus.checking = false;
                updateStatus.downloading = true;
                updateStatus.errorOnUpdateCheck = false;
                updateStatus.latestVersionRunning = false;
                updateStatus.updateAvailable = false;
            }
        },
        changeUpdateStatus(result: UpdateCheckResult) {
            const updateStatus: UpdateStatus = this.updateStatus;
            if (result === UpdateCheckResult.Error) {
                updateStatus.checking = false;
                updateStatus.downloading = false;
                updateStatus.errorOnUpdateCheck = true;
                updateStatus.latestVersionRunning = false;
                updateStatus.updateAvailable = false;
            }
            if (result === UpdateCheckResult.NoUpdateAvailable) {
                updateStatus.checking = false;
                updateStatus.downloading = false;
                updateStatus.errorOnUpdateCheck = false;
                updateStatus.latestVersionRunning = true;
                updateStatus.updateAvailable = false;
            }
            if (result === UpdateCheckResult.UpdateAvailable) {
                updateStatus.checking = false;
                updateStatus.downloading = false;
                updateStatus.errorOnUpdateCheck = false;
                updateStatus.latestVersionRunning = false;
                updateStatus.updateAvailable = true;
            }
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (settingName === this.settingName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });

        vueEventDispatcher.$on(VueEventChannels.checkForUpdateResponse, (updateCheckResult: UpdateCheckResult) => {
            this.changeUpdateStatus(updateCheckResult);
        });

        setTimeout(() => {
            this.checkForUpdate();
        }, 500);
    },
    props: ["config", "translations"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.generalSettings }}
                </span>
                <div>
                    <div class="dropdown is-right" :class="{ 'is-active' : dropdownVisible}">
                        <div class="dropdown-trigger">
                            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="dropdownTrigger">
                                <span class="icon">
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a href="#" class="dropdown-item" @click="importSettings">
                                    <span class="icon"><i class="fa fa-file-import"></i></span>
                                    <span>{{ translations.generalSettingsImportSettings }}</span>
                                </a>
                                <a class="dropdown-item" @click="exportCurrentSettings">
                                    <span class="icon"><i class="fa fa-file-export"></i></span>
                                    <span>{{ translations.generalSettingsExportSettings }}</span>
                                </a>
                                <a class="dropdown-item" @click="resetAllSettingsToDefault">
                                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                                    <span>{{ translations.generalSettingsResetAllSettings }}</span>
                                </a>
                                <a class="dropdown-item" @click="clearExecutionLog">
                                    <span class="icon"><i class="fas fa-trash"></i></span>
                                    <span>{{ translations.clearExecutionLog }}</span>
                                </a>
                                <a class="dropdown-item" @click="openDebugLog">
                                    <span class="icon"><i class="fas fa-bug"></i></span>
                                    <span>{{ translations.openDebugLog }}</span>
                                </a>
                                <a class="dropdown-item" @click="openTempFolder">
                                    <span class="icon"><i class="fas fa-folder"></i></span>
                                    <span>{{ translations.openTempFolder }}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <div class="settings__setting-content">

                <div class="box">
                    <div class="settings__options-container">

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsLanguage }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <div class="select">
                                            <select v-model="config.generalOptions.language" @change="updateConfig()">
                                                <option v-for="availableLanguage in availableLanguages">{{ availableLanguage }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsAutostartApp }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="autoStartCheckbox" type="checkbox" name="autoStartCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.autostart" @change="updateConfig()">
                                        <label for="autoStartCheckbox"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsShowTrayIcon }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="showTrayIconCheckbox" type="checkbox" name="showTrayIconCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.showTrayIcon" @change="updateConfig()">
                                        <label for="showTrayIconCheckbox"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsClearCachesOnExit }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="clearCachesOnExit" type="checkbox" name="clearCachesOnExit" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.clearCachesOnExit" @change="updateConfig()">
                                        <label for="clearCachesOnExit"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsHotKey }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right">
                                    <div class="control">
                                        <div class="select">
                                            <select v-model="config.generalOptions.hotKey.modifier" @change="updateConfig()">
                                                <option v-for="globalHotKeyModifier in globalHotKeyModifiers.filter(key => key != config.generalOptions.hotKey.secondModifier)" :value="globalHotKeyModifier">
                                                    {{ getTranslatedGlobalHotKeyModifier(globalHotKeyModifier) }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="control">
                                        <button class="button is-static">
                                            <span class="icon">
                                                <i class="fa fa-plus"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="control">
                                        <div class="select">
                                            <select v-model="config.generalOptions.hotKey.secondModifier" @change="updateConfig()">
                                                <option v-for="globalHotKeyModifier in globalHotKeyModifiers.filter(key => key != config.generalOptions.hotKey.modifier)" :value="globalHotKeyModifier">
                                                    {{ getTranslatedGlobalHotKeyModifier(globalHotKeyModifier) }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="control">
                                        <button class="button is-static">
                                            <span class="icon">
                                                <i class="fa fa-plus"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="control">
                                        <div class="select">
                                            <select v-model="config.generalOptions.hotKey.key" @change="updateConfig()">
                                                <option v-for="globalHotKeyKey in globalHotKeyKeys" :value="globalHotKeyKey">
                                                    {{ getTranslatedGlobalHotKeyKey(globalHotKeyKey) }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsRescanIntervalEnabled }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input id="rescanEnabledCheckbox" type="checkbox" name="rescanEnabledCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.rescanEnabled" @change="updateConfig()">
                                        <label for="rescanEnabledCheckbox"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option" v-if="config.generalOptions.rescanEnabled">
                            <div class="settings__option-name">{{ translations.generalSettingsRescanInterval }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input class="input" type="number" min="10" v-model="config.generalOptions.rescanIntervalInSeconds" @change="updateConfig()">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">Allow window move</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="allowWindowMoveToggle" type="checkbox" name="allowWindowMoveToggle" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.allowWindowMove" @change="updateConfig()">
                                        <label for="allowWindowMoveToggle"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option" v-if="config.generalOptions.allowWindowMove">
                            <div class="settings__option-name">{{ translations.generalSettingsRememberWindowPosition }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="rememberWindowPositionCheckbox" type="checkbox" name="rememberWindowPositionCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.rememberWindowPosition" @change="updateConfig()">
                                        <label for="rememberWindowPositionCheckbox"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option" v-if="!config.generalOptions.rememberWindowPosition">
                            <div class="settings__option-name">{{ translations.generalSettingsShowAlwaysOnPrimaryDisplay }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="showAlwaysOnPrimaryDisplayCheckbox" type="checkbox" name="showAlwaysOnPrimaryDisplayCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.showAlwaysOnPrimaryDisplay" @change="updateConfig()">
                                        <label for="showAlwaysOnPrimaryDisplayCheckbox"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsLogExecution }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="logExecutionCheckbox" type="checkbox" name="logExecutionCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.logExecution" @change="updateConfig()">
                                        <label for="logExecutionCheckbox"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsPersistentUserInput }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="persistentUserInput" type="checkbox" name="persistentUserInput" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.persistentUserInput" @change="updateConfig()">
                                        <label for="persistentUserInput"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsHideMainWindowAfterExecution }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="hideMainWindowAfterExecution" type="checkbox" name="hideMainWindowAfterExecution" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.hideMainWindowAfterExecution" @change="updateConfig()">
                                        <label for="hideMainWindowAfterExecution"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsHideMainWindowOnBlur }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="hideMainWindowOnBlur" type="checkbox" name="hideMainWindowOnBlur" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.hideMainWindowOnBlur" @change="updateConfig()">
                                        <label for="hideMainWindowOnBlur"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.generalSettingsDecimalSeparator }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="buttons has-addons">
                                        <button class="button"
                                            :class="{ 'is-success': config.generalOptions.decimalSeparator == '.' }"
                                            @click="config.generalOptions.decimalSeparator = '.'; updateConfig();">.</button>
                                        <button class="button"
                                            :class="{ 'is-success': config.generalOptions.decimalSeparator == ',' }"
                                            @click="config.generalOptions.decimalSeparator = ','; updateConfig();">,</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">Update</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <button class="button" v-if="updateStatus.checking" disabled>
                                            {{ translations.generalSettingsCheckingForUpdate }}...
                                        </button>
                                        <button class="button" :disabled="appIsInDevelopment" v-if="updateStatus.updateAvailable" @click="downloadUpdate">
                                            {{ translations.generalSettingsDownloadUpdate }}
                                        </button>
                                        <button class="button" disabled v-if="updateStatus.downloading">
                                            {{ translations.generalSettingsDownloadingUpdate }}...
                                        </button>
                                        <button class="button" v-if="updateStatus.latestVersionRunning" disabled>
                                            {{ translations.generalSettingsLatestVersion }}
                                        </button>
                                        <button class="button" v-if="updateStatus.errorOnUpdateCheck" disabled>
                                            {{ translations.generalSettingsErrorWhileCheckingForUpdate }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="box">
                    <div class="settings__options-container">
                        <div class="settings__option">
                            <div class="settings__option-name">
                                ueli
                            </div>
                            <div class="settings__option-content has-text-right">
                                {{ appInfo.ueli }}
                            </div>
                        </div>
                        <div class="settings__option">
                            <div class="settings__option-name">
                                Electron
                            </div>
                            <div class="settings__option-content has-text-right">
                                {{ appInfo.electron }}
                            </div>
                        </div>
                        <div class="settings__option">
                            <div class="settings__option-name">
                                Node
                            </div>
                            <div class="settings__option-content has-text-right">
                                {{ appInfo.node }}
                            </div>
                        </div>
                        <div class="settings__option">
                            <div class="settings__option-name">
                                V8
                            </div>
                            <div class="settings__option-content has-text-right">
                                {{ appInfo.v8 }}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,
});
