import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { NotificationType } from "../../common/notification-type";
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

            const type = this.notification.type as NotificationType;
            switch (type) {
                case NotificationType.Error:
                    typeClass = "is-danger";
                    break;
                case NotificationType.Warning:
                    typeClass = "is-warning";
                    break;
            }

            return this.notification.visible ? `visible ${typeClass}` : typeClass;
        },
    },
    data() {
        return {
            generalSettingMenuItems: Object.values(GeneralSettings).sort(),
            notification: {
                message: "",
                type: undefined,
                visible: false,
            },
            pluginSettingMenuItems: Object.values(PluginSettings)
                .map((setting) => setting.toString())
                .concat(
                    Object.values(SettingOsSpecific)
                        .map((setting) => setting.toString())
                        .filter((setting: string) => setting.startsWith(platform()))
                        .map((setting: string) => setting.replace(`${platform()}:`, "")),
                )
                .sort(),
        };
    },
    methods: {
        removeNotification() {
            this.notification.visible = false;
        },
        showNotification(message: string, type: NotificationType) {
            if (autoHideErrorMessageTimeout) {
                clearTimeout(autoHideErrorMessageTimeout);
            }

            this.notification = {
                message,
                type,
                visible: true,
            };

            autoHideErrorMessageTimeout = Number(
                setTimeout(() => {
                    this.removeNotification();
                }, autoHideErrorMessageDelayInMilliseconds),
            );
        },
    },
    props: ["config", "translations"],
    mounted() {
        vueEventDispatcher.$emit(VueEventChannels.showSetting, GeneralSettings.General);

        vueEventDispatcher.$on(VueEventChannels.notification, (message: string, type: NotificationType) => {
            this.showNotification(message, type);
        });
    },
    template: `
        <div class="settings container is-fluid">
            <settings-loading-overlay></settings-loading-overlay>
            <div class="settings__sidebar menu">
                <div class="settings__sidebar-header-container">
                    <img class="settings__sidebar-header-image" src="./assets/ueli.svg">
                    <span class="settings__sidebar-header-title">{{ translations.settings }}</span>
                </div>
                <div class="menu-label">
                    {{ translations.generalSettingsMenuSection }}
                </div>
                <ul class="menu-list">
                    <setting-menu-item
                        v-for="generalSettingMenuItem in generalSettingMenuItems"
                        :key="generalSettingMenuItem"
                        :item="generalSettingMenuItem"
                        :translations="translations"
                        :config="config"
                        ></setting-menu-item>
                </ul>
                <div class="menu-label">
                    {{ translations.pluginSettingsMenuSection }}
                </div>
                <ul class="menu-list">
                    <setting-menu-item
                        v-for="pluginSettingMenuItem in pluginSettingMenuItems"
                        :key="pluginSettingMenuItem"
                        :item="pluginSettingMenuItem"
                        :translations="translations"
                        :config="config"
                        ></setting-menu-item>
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
                <operating-system-commands-settings :config="config" :translations="translations"></operating-system-commands-settings>
                <operating-system-settings-settings :config="config" :translations="translations"></operating-system-settings-settings>
                <calculator-settings :config="config" :translations="translations"></calculator-settings>
                <dictionary-settings :config="config" :translations="translations"></dictionary-settings>
                <url-settings :config="config" :translations="translations"></url-settings>
                <email-settings :config="config" :translations="translations"></email-settings>
                <currency-converter-settings :config="config" :translations="translations"></currency-converter-settings>
                <workflow-settings :config="config" :translations="translations"></workflow-settings>
                <commandline-settings :config="config" :translations="translations"></commandline-settings>
                <simple-folder-search-settings :config="config" :translations="translations"></simple-folder-search-settings>
                <uwp-settings :config="config" :translations="translations"></uwp-settings>
                <color-converter-setttings :config="config" :translations="translations"></color-converter-setttings>
                <user-confirmation :translations="translations"></user-confirmation>
                <browser-bookmark-settings :config="config" :translations="translations"></browser-bookmark-settings>
                <control-panel-settings :config="config" :translations="translations"></control-panel-settings>
            </div>
        </div>
    `,
});
