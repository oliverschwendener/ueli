import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { SettingsNotificationType } from "./settings-notification-type";
import { ipcRenderer } from "electron";
import { IpcChannels } from "../../common/ipc-channels";
import { Settings } from "./settings";
import { SettingOsSpecific } from "./settings-os-specific";
import { platform } from "os";

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
            notification: {
                message: "",
                type: undefined,
                visible: false,
            },
            settingMenuItems: Object
                .values(Settings)
                .concat(Object
                    .values(SettingOsSpecific)
                    .filter((setting: string) => setting.startsWith(platform()))
                    .map((setting: string) => setting.replace(`${platform()}:`, "")))
                .sort(),
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
        vueEventDispatcher.$emit(VueEventChannels.showSetting, Settings.General);

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
        <div class="settings container">
            <settings-loading-overlay></settings-loading-overlay>
            <div class="settings__sidebar menu">
                <ul class="menu-list">
                    <setting-menu-item
                        v-for="settingMenuItem in settingMenuItems"
                        :item="settingMenuItem"
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
            </div>
        </div>
    `,
});
