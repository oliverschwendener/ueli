import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";

export const settingsLoadingOverlayComponent = Vue.extend({
    data() {
        return {
            loading: false,
        };
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.loadingStarted, () => {
            this.loading = true;
        });

        vueEventDispatcher.$on(VueEventChannels.loadingCompleted, () => {
            this.loading = false;
        });
    },
    template: `
        <div class="settings-loading-overlay" v-if="loading">
            <div class="lds-dual-ring"></div>
        </div>
    `,
});
