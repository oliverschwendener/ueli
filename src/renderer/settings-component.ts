import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { SettingsNotificationType } from "./settings-notification-type";
import { ipcRenderer } from "electron";
import { IpcChannels } from "../common/ipc-channels";

const autoHideErrorMessageDelayInMilliseconds = 5000;
let autoHideErrorMessageTimeout: NodeJS.Timeout;

export const settingsComponent = Vue.extend({
    computed: {
        notificationClass() {
            let typeClass = "is-info";

            const type = this.notification.type as SettingsNotificationType;
            // tslint:disable-next-line:no-console
            console.log(type);
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
            settingMenuItems: [
                { name: "Appearance", slug: "appearance" },
                { name: "Search Engine", slug: "search-engine" },
                { name: "Application Search", slug: "application-search" },
            ],
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

            autoHideErrorMessageTimeout = setTimeout(() => {
                this.removeNotification();
            }, autoHideErrorMessageDelayInMilliseconds);
        },
    },
    props: ["config"],
    mounted() {
        vueEventDispatcher.$emit(VueEventChannels.showSetting, this.settingMenuItems[0].slug);

        vueEventDispatcher.$on(VueEventChannels.pushNotification, (message: string, type: SettingsNotificationType) => {
            this.showNotification(message, type);
        });

        ipcRenderer.on(IpcChannels.indexRefreshSucceeded, (event: Electron.Event, message: string) => {
            this.showNotification(message, SettingsNotificationType.Info);
            vueEventDispatcher.$emit(VueEventChannels.loadingCompleted);
        });
    },
    template: `
        <div class="settings container">
            <settings-loading-overlay></settings-loading-overlay>
            <div class="settins__sidebar menu">
                <ul class="menu-list">
                    <setting-menu-item v-for="settingMenuItem in settingMenuItems" :name="settingMenuItem.name" :slug="settingMenuItem.slug"></setting-menu-item>
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
                <appearance-settings></appearance-settings>
                <search-engine-settings></search-engine-settings>
                <application-search-settings :config="config"></application-search-settings>
            </div>
        </div>
    `,
});
