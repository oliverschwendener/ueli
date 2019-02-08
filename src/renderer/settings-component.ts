import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { SettingsNotificationType } from "./settings-notification-type";
import { ipcRenderer } from "electron";
import { IpcChannels } from "../common/ipc-channels";
import { Settings } from "./settings";

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
            settingMenuItems: Object.values(Settings).sort(),
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
    props: ["config"],
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
                    <setting-menu-item v-for="settingMenuItem in settingMenuItems" :name="settingMenuItem"></setting-menu-item>
                </ul>
            </div>
            <div
                class="settings__notification notification"
                :class="notificationClass"
                >
                <button class="delete" @click="removeNotification"></button>
                {{ notification.message }}
            </div>
            <div class="settings__setting">
                <general-settings :config="config"></general-settings>
                <appearance-settings :config="config"></appearance-settings>
                <search-engine-settings :config="config"></search-engine-settings>
                <application-search-settings :config="config"></application-search-settings>
                <shortcut-settings :config="config"></shortcut-settings>
            </div>
        </div>
    `,
});
