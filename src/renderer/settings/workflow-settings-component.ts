import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultWorkflowIcon } from "../../common/icon/default-icons";
import { WorkflowExecutionArgumentType } from "../../main/plugins/workflow-plugin/workflow-execution-argument-type";
import { Workflow } from "../../main/plugins/workflow-plugin/workflow";
import { ModalEditMode } from "./modals/modal-edit-mode";
import { getWorkflowExecutionArgumentTypeIcon, getWorkflowExecutionArgumentTypeClass } from "./helpers";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { defaultWorkflowOptions } from "../../common/config/workflow-options";
import { deepCopy } from "../../common/helpers/object-helpers";

const defaultNewWorkflow: Workflow = {
    description: "",
    executionSteps: [],
    icon: defaultWorkflowIcon,
    name: "",
    needsUserConfirmationBeforeExecution: false,
    tags: [],
};

export const workflowSettingsComponent = Vue.extend({
    data() {
        return {
            defaultWorkflowIcon,
            settingName: PluginSettings.Workflow,
            visible: false,
        };
    },
    methods: {
        addWorkflow(workflow: Workflow) {
            const config: UserConfigOptions = this.config;
            config.workflowOptions.workflows.push(deepCopy(workflow));
            this.updateConfig();
        },
        updateWorkflow(workflow: Workflow, saveIndex: number) {
            const config: UserConfigOptions = this.config;
            const newWorkflowOptions = deepCopy(config.workflowOptions);
            newWorkflowOptions.workflows[saveIndex] = deepCopy(workflow);
            config.workflowOptions = deepCopy(newWorkflowOptions);
            this.updateConfig();
        },
        addButtonClick() {
            vueEventDispatcher.$emit(
                VueEventChannels.openWorkflowEditingModal,
                deepCopy(defaultNewWorkflow),
                ModalEditMode.Add,
            );
        },
        editWorkflow(index: number) {
            const config: UserConfigOptions = this.config;
            const workflow: Workflow = deepCopy(config.workflowOptions.workflows[index]);
            vueEventDispatcher.$emit(VueEventChannels.openWorkflowEditingModal, workflow, ModalEditMode.Edit, index);
        },
        deleteWorkflow(index: number) {
            const config: UserConfigOptions = this.config;
            config.workflowOptions.workflows.splice(index, 1);
            this.updateConfig();
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.workflowOptions.isEnabled = !config.workflowOptions.isEnabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.workflowOptions = deepCopy(defaultWorkflowOptions);
                    this.updateConfig();
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        getExecutionArgumentTypeIcon(type: WorkflowExecutionArgumentType): string {
            return getWorkflowExecutionArgumentTypeIcon(type);
        },
        getExecutionArgumentTypeClass(type: WorkflowExecutionArgumentType): string {
            return getWorkflowExecutionArgumentTypeClass(type);
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

        vueEventDispatcher.$on(
            VueEventChannels.workflowEdited,
            (workflow: Workflow, editMode: ModalEditMode, saveIndex?: number) => {
                if (editMode === ModalEditMode.Add) {
                    this.addWorkflow(workflow);
                } else if (editMode === ModalEditMode.Edit) {
                    this.updateWorkflow(workflow, saveIndex);
                }
            },
        );
    },
    props: ["config", "translations"],
    template: `
    <div v-if="visible">
        <div class="settings__setting-title title is-3">
            <span>
                {{ translations.workflows }}
            </span>
            <div>
                <plugin-toggle :is-enabled="config.workflowOptions.isEnabled" :toggled="toggleEnabled"/>
                <button v-if="config.workflowOptions.isEnabled" class="button" @click="resetAll">
                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                </button>
            </div>
        </div>
        <p class="settings__setting-description" v-html="translations.workflowSettingsDescription"></p>
        <div class="settings__setting-content">
            <div v-if="!config.workflowOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
            <div class="settings__setting-content-item box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">
                        {{ translations.workflows }}
                    </div>
                </div>
                <div class="table-container">
                    <table class="table is-striped is-fullwidth" v-if="config.workflowOptions.workflows.length > 0">
                        <thead>
                            <tr>
                                <th class="has-text-centered">{{ translations.edit }}</th>
                                <th class="has-text-centered">{{ translations.remove }}</th>
                                <th>{{ translations.workflowName }}</th>
                                <th>{{ translations.workflowDescription }}</th>
                                <th class="has-text-centered">{{ translations.workflowNeedsUserConfirmationBeforeExecution }}</th>
                                <th>{{ translations.workflowTags }}</th>
                                <th class="has-text-centered">{{ translations.workflowIcon }}</th>
                                <th>{{ translations.workflowExecutionSteps }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(workflow, index) in config.workflowOptions.workflows">
                                <td class="has-text-centered">
                                    <button class="button" @click="editWorkflow(index)">
                                        <span class="icon"><i class="fas fa-edit"></i></span>
                                    </button>
                                </td>
                                <td class="has-text-centered">
                                    <button class="button is-danger" @click="deleteWorkflow(index)">
                                        <span class="icon"><i class="fas fa-trash"></i></span>
                                    </button>
                                </td>
                                <td>{{ workflow.name }}</td>
                                <td>{{ workflow.description }}</td>
                                <td class="has-text-centered"><i v-if="workflow.needsUserConfirmationBeforeExecution" class="fas fa-check"></i></td>
                                <td>
                                    <div v-if="workflow.tags.length > 0" class="tags">
                                        <span v-for="tag in workflow.tags" class="tag is-light">{{ tag }}</span>
                                    </div>
                                </td>
                                <td class="has-text-centered">
                                    <icon :icon="workflow.icon" :defaulticon="defaultWorkflowIcon"></icon>
                                </td>
                                <td>
                                    <div v-for="executionStep in workflow.executionSteps" class="tags has-addons is-marginless">
                                        <span class="tag" :class="getExecutionArgumentTypeClass(executionStep.executionArgumentType)">
                                            <span class="icon">
                                                <i :class="getExecutionArgumentTypeIcon(executionStep.executionArgumentType)"></i>
                                            </span>
                                        </span>
                                        <span class="tag is-dark">{{ executionStep.executionArgument }}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <button class="button is-success" @click="addButtonClick">
                        <span class="icon"><i class="fas fa-plus"></i></span>
                        <span>{{ translations.workflowSettingsAddWorkflow }}</span>
                    </button>
                </div>
            </div>
        </div>
        <workflow-editing-modal :translations="translations"></workflow-editing-modal>
    </div>
    `,
});
