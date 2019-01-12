import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";

export const settingsComponent = Vue.extend({
    methods: {
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    props: ["config"],
    template: `
        <div class="settings__container container-fluid">
            <application-search-settings :config="config">
        </div>
    `,
});
