import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";

export const settingsLoadingOverlayComponent = Vue.extend({
    data() {
        return {
            delay: undefined,
            loading: false,
            showLoader: false,
        };
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.refreshIndexesStarted, () => {
            this.loading = true;

            setTimeout(() => {
                if (this.loading) {
                    this.showLoader = true;
                }
            }, 250);
        });

        vueEventDispatcher.$on(VueEventChannels.refreshIndexesFinished, () => {
            this.loading = false;
            this.showLoader = false;
        });
    },
    template: `
        <div class="settings-loading-overlay" v-if="showLoader">
            <div class="lds-dual-ring"></div>
        </div>
    `,
});
