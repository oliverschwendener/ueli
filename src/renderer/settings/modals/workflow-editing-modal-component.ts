import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import { Workflow } from "../../../main/plugins/workflow-plugin/workflow";
import { TranslationSet } from "../../../common/translation/translation-set";
import { isEqual, cloneDeep } from "lodash";
import { ModalEditMode } from "./modal-edit-mode";
import { WorkflowExecutionArgumentType } from "../../../main/plugins/workflow-plugin/workflow-execution-argument-type";
import { getWorkflowExecutionArgumentTypeIcon, getWorkflowExecutionArgumentTypeClass, getWorkflowExecutionArgumentTypeTranslation } from "../helpers";
import { WorkflowExecutionStep } from "../../../main/plugins/workflow-plugin/workflow-execution-argument";
import { getFileAndFolderPaths } from "../../dialogs";
import { isValidExecutionStep, isValidWorkflow } from "../../../main/plugins/workflow-plugin/workflow-helpers";
import { SettingsNotificationType } from "../settings-notification-type";

const initialNewWorkflowExecutionStep: WorkflowExecutionStep = {
    executionArgument: "",
    executionArgumentType: WorkflowExecutionArgumentType.FilePath,
};

export const workflowEditingModal = Vue.extend({
    computed: {
        noChanges(): boolean {
            return isEqual(this.initialWorkflow, this.workflow);
        },
    },
    data() {
        return {
            editMode: ModalEditMode.Add,
            executionArgumentTypeFilePath: WorkflowExecutionArgumentType.FilePath,
            executionArgumentTypes: Object.values(WorkflowExecutionArgumentType).sort(),
            initialWorkflow: {},
            newWorkflowExecutionStep: cloneDeep(initialNewWorkflowExecutionStep),
            saveIndex: undefined,
            visible: false,
            workflow: {},
        };
    },
    methods: {
        addExecutionStep() {
            const workflow: Workflow = this.workflow;
            const executionStep: WorkflowExecutionStep = this.newWorkflowExecutionStep;
            if (isValidExecutionStep(executionStep)) {
                workflow.executionSteps.push(executionStep);
                this.resetNewExecutionStep();
            } else {
                const translations: TranslationSet = this.translations;
                vueEventDispatcher.$emit(VueEventChannels.notification, translations.workflowInvalidExecutionStep, SettingsNotificationType.Error);
            }
        },
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
        getExecutionArgumentTypeIcon(type: WorkflowExecutionArgumentType): string {
            return getWorkflowExecutionArgumentTypeIcon(type);
        },
        getExecutionArgumentTypeClass(type: WorkflowExecutionArgumentType): string {
            return getWorkflowExecutionArgumentTypeClass(type);
        },
        getTranslationForExecutionArgumentType(type: WorkflowExecutionArgumentType): string {
            const translations: TranslationSet = this.translations;
            return getWorkflowExecutionArgumentTypeTranslation(type, translations);
        },
        onNewExecutionStepTypeChange() {
            const executionStep: WorkflowExecutionStep = this.newWorkflowExecutionStep;
            executionStep.executionArgument = "";
        },
        openFile() {
            getFileAndFolderPaths()
                .then((filePaths) => {
                    if (filePaths && filePaths.length > 0) {
                        const executionStep: WorkflowExecutionStep = this.newWorkflowExecutionStep;
                        executionStep.executionArgument = filePaths[0];
                    }
                });
        },
        removeExecutionStep(index: number) {
            const workflow: Workflow = this.workflow;
            workflow.executionSteps.splice(index, 1);
        },
        resetNewExecutionStep() {
            this.newWorkflowExecutionStep = cloneDeep(initialNewWorkflowExecutionStep);
        },
        saveButtonClick() {
            if (isValidWorkflow(this.workflow)) {
                vueEventDispatcher.$emit(VueEventChannels.workflowEdited, this.workflow, this.editMode, this.saveIndex);
                this.closeModal();
            } else {
                const translations: TranslationSet = this.translations;
                vueEventDispatcher.$emit(VueEventChannels.notification, translations.workflowInvalidWorkflow, SettingsNotificationType.Error);
            }
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.openWorkflowEditingModal, (workflow: Workflow, editMode: ModalEditMode, saveIndex?: number) => {
            this.visible = true;
            this.editMode = editMode;
            this.workflow = workflow;
            this.initialWorkflow = cloneDeep(workflow);
            this.saveIndex = saveIndex;
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
                        <div class="field">
                            <label class="label">{{ translations.workflowExecutionSteps }}</label>
                        </div>
                        <div class="field has-addons" v-for="(executionStep, index) in workflow.executionSteps">
                            <div class="control">
                                <button disabled class="button" :class="getExecutionArgumentTypeClass(executionStep.executionArgumentType)">
                                    <span class="icon">
                                        <i :class="getExecutionArgumentTypeIcon(executionStep.executionArgumentType)">
                                    </span
                                </button>
                            </div>
                            <div class="control is-expanded">
                                <input readonly class="input" v-model="executionStep.executionArgument">
                            </div>
                            <div class="control">
                                <button class="button is-danger" @click="removeExecutionStep(index)">
                                    <span class="icon">
                                        <i class="fas fa-trash"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div class="field has-addons">
                            <div class="control">
                                <div class="select">
                                    <select v-model="newWorkflowExecutionStep.executionArgumentType" @change="onNewExecutionStepTypeChange">
                                        <option v-for="executionArgumentType in executionArgumentTypes" :value="executionArgumentType">
                                            {{ getTranslationForExecutionArgumentType(executionArgumentType) }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="control is-expanded">
                                <input class="input" v-model="newWorkflowExecutionStep.executionArgument">
                            </div>
                            <div class="control" v-if="newWorkflowExecutionStep.executionArgumentType === executionArgumentTypeFilePath">
                                <button class="button" @click="openFile">
                                    <span class="icon">
                                        <i class="fas fa-folder"></i>
                                    </span>
                                </button>
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="addExecutionStep">
                                    <span class="icon">
                                        <i class="fas fa-plus"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div class="field is-grouped is-grouped-right">
                            <div class="control">
                                <button class="button is-danger" @click="closeModal">
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
