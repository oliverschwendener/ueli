import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";

export const appearanceSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: "appearance",
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
            <span>Appearance</span>
        </div>
    </div>
    `,
});
