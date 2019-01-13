import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";

const autoHideErrorMessageDelayInMilliseconds = 5000;
let autoHideErrorMessageTimeout: NodeJS.Timeout;

export const settingsComponent = Vue.extend({
    data() {
        return {
            errorMessage: "",
        };
    },
    methods: {
        removeErrorMessage() {
            this.errorMessage = "";
        },
    },
    props: ["config"],
    mounted() {
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
            <div class="settings__notification notification is-danger" :class="{ 'hidden' : errorMessage.length === 0 }">
                <button class="delete" @click="removeErrorMessage"></button>
                {{ errorMessage }}
            </div>
            <application-search-settings :config="config">
        </div>
    `,
});
