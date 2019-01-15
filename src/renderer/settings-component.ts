import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";

const autoHideErrorMessageDelayInMilliseconds = 5000;
let autoHideErrorMessageTimeout: NodeJS.Timeout;

export const settingsComponent = Vue.extend({
    data() {
        return {
            errorMessage: "",
            settingMenuItems: [
                { name: "Appearance", slug: "appearance" },
                { name: "Search Engine", slug: "search-engine" },
                { name: "Application Search", slug: "application-search" },
            ],
        };
    },
    methods: {
        removeErrorMessage() {
            this.errorMessage = "";
        },
    },
    props: ["config"],
    mounted() {
        vueEventDispatcher.$emit(VueEventChannels.showSetting, this.settingMenuItems[0].slug);

        vueEventDispatcher.$on(VueEventChannels.settingsError, (message: string) => {
            if (autoHideErrorMessageTimeout) {
                clearTimeout(autoHideErrorMessageTimeout);
            }

            this.errorMessage = message;
            autoHideErrorMessageTimeout = setTimeout(() => {
                this.removeErrorMessage();
            }, autoHideErrorMessageDelayInMilliseconds);
        });
    },
    template: `
        <div class="settings container">
            <div class="settins__sidebar menu">
                <ul class="menu-list">
                    <setting-menu-item v-for="settingMenuItem in settingMenuItems" :name="settingMenuItem.name" :slug="settingMenuItem.slug"></setting-menu-item>
                </ul>
            </div>
            <div class="settings__notification notification is-danger" :class="{ 'hidden' : errorMessage.length === 0 }">
                <button class="delete" @click="removeErrorMessage"></button>
                {{ errorMessage }}
            </div>
            <div class="settings__setting">
                <appearance-settings></appearance-settings>
                <search-engine-settings></search-engine-settings>
                <application-search-settings :config="config"></application-search-settings>
            </div>
        </div>
    `,
});
