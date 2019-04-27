import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import { Workflow } from "../../../main/plugins/workflow-plugin/workflow";
import { ModalEditMode } from "./shortcut-editing-modal-component";
import { TranslationSet } from "../../../common/translation/translation-set";

export const workflowEditingModal = Vue.extend({
    data() {
        return {
            editMode: ModalEditMode.Add,
            saveIndex: undefined,
            visible: false,
            workflow: {},
        };
    },
    methods: {
        getModalTitle(): string {
            const translations: TranslationSet = this.translations;
            const editMode: ModalEditMode = this.editMode;
            switch (editMode) {
                case ModalEditMode.Add:
                    return translations.add;
                case ModalEditMode.Edit:
                    return translations.edit;
            }
        },
        closeModal() {
            this.workflow = {};
            this.visible = false;
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.openWorkflowEditingModal, (workflow: Workflow, editMode: ModalEditMode, saveIndex?: number) => {
            this.visible = true;
            this.editMode = editMode;
            this.workflow = workflow;
        });
    },
    props: ["translations"],
    template: `
        <div class="modal" :class="{ 'is-active' : visible }">
            <div class="modal-background" @click="closeModal"></div>
            <div class="modal-content">
                <div class="message">
                    <div class="message-header">
                        <p>
                            {{ getModalTitle() }}
                        </p>
                        <button class="delete" aria-label="delete" @click="closeModal"></button>
                    </div>
                    <div class="message-body">
                        <div class="field">
                            <label class="label">
                                {{ translations.workflowName }}
                            </label>
                            <div class="control">
                                <input class="input" type="text" :placeholder="translations.workflowNamePlaceholder" v-model="workflow.name">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">
                                {{ translations.workflowDescription }}
                            </label>
                            <div class="control">
                                <input class="input" type="text" :placeholder="translations.workflowDescriptionPlaceholder" v-model="workflow.description">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
