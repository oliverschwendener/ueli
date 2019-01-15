import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { UserConfigOptions } from "../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultSearchEngineOptions } from "../common/config/default-search-engine-options";

export const searchEngineSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: "search-engine",
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.searchEngineOptions = cloneDeep(defaultSearchEngineOptions);
            this.updateConfig();
        },
        resetFuzzyness() {
            const config: UserConfigOptions = this.config;
            config.searchEngineOptions.fuzzyness = defaultSearchEngineOptions.fuzzyness;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
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
    props: ["config"],
    template: `
    <div v-if="visible">
        <div class="settings__setting-title title is-3">
            <span>Search Engine</span>
            <button class="button" @click="resetAll">
                <span class="icon"><i class="fas fa-undo-alt"></i></span>
            </button>
        </div>
        <div class="settings__setting-content">
            <div class="settings__setting-content-item box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">Fuzzyness: {{ config.searchEngineOptions.fuzzyness }}</div>
                    <button class="button" @click="resetFuzzyness"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                </div>
                <div class="columns">
                    <div class="column">
                        <input class="slider is-fullwidth is-large" type="range" min="0.01" max="1" step="0.01" v-model="config.searchEngineOptions.fuzzyness" @change="updateConfig">
                    </div>
                </div>
            </div>
        </div>
    </div>`,
});
