import Vue from "vue";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";

export const settingMenuItemComponent = Vue.extend({
    methods: {
        showSetting() {
            vueEventDispatcher.$emit(VueEventChannels.showSetting, this.slug);
        },
    },
    props: ["slug", "name"],
    template: `<li @click="showSetting">
        <a>
            {{ name }}
        </a>
    </li>`,
});
