import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";

export const searchEngineSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: "search-engine",
            visible: false,
        };
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (settingName === this.settingName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });
    },
    template: `
    <div v-if="visible">
        <div class="settings__setting-title">
            <span>Search Engine</span>
        </div>
    </div>`,
});
