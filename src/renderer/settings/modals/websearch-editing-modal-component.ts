import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import { WebSearchEngine } from "../../../main/plugins/websearch-plugin/web-search-engine";
import { ModalEditMode } from "./shortcut-editing-modal-component";
import { cloneDeep, isEqual } from "lodash";
import { defaultNewWebSearchEngine, isValidForAdd } from "../../../main/plugins/websearch-plugin/web-search-helpers";
import { TranslationSet } from "../../../common/translation/translation-set";
import { SettingsNotificationType } from "../settings-notification-type";

export const websearchEditingModal = Vue.extend({
    computed: {
        noChanges(): boolean {
            return isEqual(this.initalWebSearchEngine, this.websearchEngine);
        },
    },
    data() {
        return {
            autofocus: true,
            visible: false,
            websearchEngine: cloneDeep(defaultNewWebSearchEngine),
        };
    },
    methods: {
        onBackgroundClick() {
            this.visible = false;
        },
        closeButtonClick() {
            this.visible = false;
        },
        saveButtonClick() {
            const websearchEngine: WebSearchEngine = this.websearchEngine;
            const translations: TranslationSet = this.translations;
            if (isValidForAdd(websearchEngine)) {
                this.visible = false;
                vueEventDispatcher.$emit(VueEventChannels.websearchEngineEdited, this.websearchEngine, this.editMode, this.saveIndex);
            } else {
                vueEventDispatcher.$emit(VueEventChannels.notification, translations.websearchInvalidWebsearchEngine, SettingsNotificationType.Error);
            }
        },
        getModalTitle(): string {
            const editMode: ModalEditMode = this.editMode;
            const translations: TranslationSet = this.translations;
            switch (editMode) {
                case ModalEditMode.Add:
                    return translations.websearchEditingModalTitleAdd;
                case ModalEditMode.Edit:
                    return translations.websearchEditingModalTitleEdit;
            }
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.openWebSearchEditingModal, (websearchEngine: WebSearchEngine, editMode: ModalEditMode, saveIndex?: number) => {
            this.visible = true;
            this.websearchEngine = websearchEngine;
            this.editMode = editMode;
            this.initalWebSearchEngine = cloneDeep(websearchEngine);
            this.saveIndex = saveIndex;
            this.autofocus = true;
        });
    },
    props: ["translations"],
    template: `
    <div class="modal" :class="{ 'is-active' : visible }">
        <div class="modal-background" @click="onBackgroundClick"></div>
        <div class="modal-content">
            <div class="message">
                <div class="message-header">
                    <p>{{ getModalTitle() }}</p>
                    <button class="delete" aria-label="delete" @click="closeButtonClick"></button>
                </div>
                <div class="message-body">

                    <div class="field">
                        <label class="label">
                            {{ translations.websearchName }}
                        </label>
                        <div class="control is-expanded">
                            <input class="input" type="text" v-model="websearchEngine.name" :autofocus="autofocus">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">
                            {{ translations.websearchPrefix }}
                        </label>
                        <div class="control is-expanded">
                            <input class="input" type="text" v-model="websearchEngine.prefix">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">
                            {{ translations.websearchUrl }}
                        </label>
                        <div class="control is-expanded">
                            <input class="input" type="url" v-model="websearchEngine.url">
                        </div>
                    </div>

                    <icon-editing
                        :icon="websearchEngine.icon"
                        :translations="translations">
                    </icon-editing>

                    <div class="field">
                        <label class="label">
                            {{ translations.websearchPriority }}
                        </label>
                        <div class="control is-expanded">
                            <input class="input" type="number" min="0" v-model="websearchEngine.priority">
                        </div>
                    </div>

                    <div class="field is-grouped is-grouped-right">
                        <div class="control">
                            <button class="button is-danger" @click="closeButtonClick">
                                <span class="icon">
                                    <i class="fas fa-times"></i>
                                </span>
                                <span>{{ translations.cancel }}</span>
                            </button>
                        </div>
                        <div class="control">
                            <button :disabled="noChanges" class="button is-success" @click="saveButtonClick">
                                <span class="icon">
                                    <i class="fas fa-check"></i>
                                </span>
                                <span>{{ translations.save }}</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    `,
});
