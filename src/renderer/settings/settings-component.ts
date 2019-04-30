import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { SettingsNotificationType } from "./settings-notification-type";
import { ipcRenderer } from "electron";
import { IpcChannels } from "../../common/ipc-channels";
import { PluginSettings } from "./plugin-settings";
import { SettingOsSpecific } from "./settings-os-specific";
import { platform } from "os";
import { GeneralSettings } from "./general-settings";

const autoHideErrorMessageDelayInMilliseconds = 5000;
let autoHideErrorMessageTimeout: number;

export const settingsComponent = Vue.extend({
    computed: {
        notificationClass() {
            let typeClass = "is-info";

            const type = this.notification.type as SettingsNotificationType;
            switch (type) {
                case SettingsNotificationType.Error:
                    typeClass = "is-danger";
                    break;
                case SettingsNotificationType.Warning:
                    typeClass = "is-warning";
                    break;
            }

            return this.notification.visible
                ? `visible ${typeClass}`
                : typeClass;
        },
    },
    data() {
        return {
            generalSettingMenuItems: Object.values(GeneralSettings),
            notification: {
                message: "",
                type: undefined,
                visible: false,
            },
            pluginSettingMenuItems: Object
                .values(PluginSettings)
                .concat(Object
                    .values(SettingOsSpecific)
                    .filter((setting: string) => setting.startsWith(platform()))
                    .map((setting: string) => setting.replace(`${platform()}:`, ""))),
        };
    },
    methods: {
        removeNotification() {
            this.notification.visible = false;
        },
        showNotification(message: string, type: SettingsNotificationType) {
            if (autoHideErrorMessageTimeout) {
                clearTimeout(autoHideErrorMessageTimeout);
            }

            this.notification = {
                message,
                type,
                visible: true,
            };

            autoHideErrorMessageTimeout = Number(setTimeout(() => {
                this.removeNotification();
            }, autoHideErrorMessageDelayInMilliseconds));
        },
    },
    props: ["config", "translations"],
    mounted() {
        vueEventDispatcher.$emit(VueEventChannels.showSetting, GeneralSettings.General);

        vueEventDispatcher.$on(VueEventChannels.notification, (message: string, type: SettingsNotificationType) => {
            this.showNotification(message, type);
        });

        ipcRenderer.on(IpcChannels.indexRefreshSucceeded, (event: Electron.Event, message: string) => {
            this.showNotification(message, SettingsNotificationType.Info);
            vueEventDispatcher.$emit(VueEventChannels.loadingCompleted);
        });

        ipcRenderer.on(IpcChannels.indexRefreshFailed, (event: Electron.Event, message: string) => {
            this.showNotification(message, SettingsNotificationType.Error);
            vueEventDispatcher.$emit(VueEventChannels.loadingCompleted);
        });
    },
    template: `
        <div class="settings container is-fluid">
            <settings-loading-overlay></settings-loading-overlay>
            <div class="settings__sidebar menu">
                <div class="settings__sidebar-header-container">
                    <img class="settings__sidebar-header-image" src="./assets/ueli-black-on-transparent-logo.png">
                    <span class="settings__sidebar-header-title">{{ translations.settings }}</span>
                </div>
                <div class="menu-label">
                    {{ translations.generalSettingsMenuSection }}
                </div>
                <ul class="menu-list">
                    <setting-menu-item
                        v-for="generalSettingMenuItem in generalSettingMenuItems"
                        :item="generalSettingMenuItem"
                        :translations="translations"
                        >
                    </setting-menu-item>
                </ul>
                <div class="menu-label">
                    {{ translations.pluginSettingsMenuSection }}
                </div>
                <ul class="menu-list">
                    <setting-menu-item
                        v-for="pluginSettingMenuItem in pluginSettingMenuItems"
                        :item="pluginSettingMenuItem"
                        :translations="translations"
                        >
                    </setting-menu-item>
                </ul>
            </div>
            <div class="settings__notification notification" :class="notificationClass">
                <button class="delete" @click="removeNotification"></button>
                {{ notification.message }}
            </div>
            <div class="settings__setting">
                <general-settings :config="config" :translations="translations"></general-settings>
                <appearance-settings :config="config" :translations="translations"></appearance-settings>
                <color-theme-settings :config="config" :translations="translations"></color-theme-settings>
                <search-engine-settings :config="config" :translations="translations"></search-engine-settings>
                <application-search-settings :config="config" :translations="translations"></application-search-settings>
                <shortcut-settings :config="config" :translations="translations"></shortcut-settings>
                <mdfind-settings :config="config" :translations="translations"></mdfind-settings>
                <everthing-settings :config="config" :translations="translations"></everthing-settings>
                <translation-settings :config="config" :translations="translations"></translation-settings>
                <websearch-settings :config="config" :translations="translations"></websearch-settings>
                <filebrowser-settings :config="config" :translations="translations"></filebrowser-settings>
                <operating-system-settings :config="config" :translations="translations"></operating-system-settings>
                <calculator-settings :config="config" :translations="translations"></calculator-settings>
                <url-settings :config="config" :translations="translations"></url-settings>
                <email-settings :config="config" :translations="translations"></email-settings>
                <currency-converter-settings :config="config" :translations="translations"></currency-converter-settings>
                <workflow-settings :config="config" :translations="translations"></workflow-settings>
                <commandline-settings :config="config" :translations="translations"></commandline-settings>
            </div>
        </div>
    `,
});
