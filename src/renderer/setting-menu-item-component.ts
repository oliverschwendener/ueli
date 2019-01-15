import Vue from "vue";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";

export const settingMenuItemComponent = Vue.extend({
    data() {
        return {
            isActive: false,
        };
    },
    methods: {
        showSetting() {
            vueEventDispatcher.$emit(VueEventChannels.showSetting, this.slug);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (slug: string) => {
            this.isActive = this.slug === slug;
        });
    },
    props: ["slug", "name"],
    template: `<li @click="showSetting">
        <a :class="{ 'is-active' : isActive }">
            {{ name }}
        </a>
    </li>`,
});
