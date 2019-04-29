import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultWorkflowOptions } from "../../common/config/default-workflow-options";
import { cloneDeep } from "lodash";
import { defaultWorkflowIcon } from "../../common/icon/default-icons";
import { WorkflowExecutionArgumentType } from "../../main/plugins/workflow-plugin/workflow-execution-argument-type";
import { Workflow } from "../../main/plugins/workflow-plugin/workflow";
import { ModalEditMode } from "./modals/shortcut-editing-modal-component";

export const workflowSettingsComponent = Vue.extend({
    data() {
        return {
            defaultWorkflowIcon,
            settingName: PluginSettings.Workflow,
            visible: false,
        };
    },
    methods: {
        addWorkflow() {

        },
        updateWorkflow() {

        },
        addButtonClick() {
            //
        },
        editWorkflow(index: number) {
            const config: UserConfigOptions = this.config;
            const workflow: Workflow = cloneDeep(config.workflowOptions.workflows[index]);
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
            const config: UserConfigOptions = this.config;
            config.workflowOptions = cloneDeep(defaultWorkflowOptions);
            this.updateConfig();
        },
        getExecutionArgumentTypeIcon(type: WorkflowExecutionArgumentType): string {
            switch (type) {
                case WorkflowExecutionArgumentType.URL:
                    return "fas fa-globe-europe";
                case WorkflowExecutionArgumentType.FilePath:
                    return "fas fa-file";
                case WorkflowExecutionArgumentType.CommandlineTool:
                    return "fas fa-terminal";
            }
        },
        getExecutionArgumentTypeClass(type: WorkflowExecutionArgumentType): string {
            switch (type) {
                case WorkflowExecutionArgumentType.URL:
                    return "is-primary";
                case WorkflowExecutionArgumentType.FilePath:
                    return "is-info";
                case WorkflowExecutionArgumentType.CommandlineTool:
                    return "is-link";
                default:
                    return "is-light";
            }
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

        vueEventDispatcher.$on(VueEventChannels.workflowEdited, (workflow: Workflow, editMode: ModalEditMode, saveIndex?: number) => {
            if (editMode === ModalEditMode.Add) {
                this.addWorkflow(workflow);
            } else if (editMode === ModalEditMode.Edit) {
                this.updateWorkflow(workflow, saveIndex);
            }
        });
    },
    props: ["config", "translations"],
    template: `
    <div v-if="visible">
        <div class="settings__setting-title title is-3">
            <span>
                {{ translations.workflows }}
            </span>
            <div>
                <button class="button" :class="{ 'is-success' : config.workflowOptions.isEnabled }" @click="toggleEnabled">
                    <span class="icon"><i class="fas fa-power-off"></i></span>
                </button>
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
                                <th>{{ translations.workflowName }}</th>
                                <th>{{ translations.workflowDescription }}</th>
                                <th>{{ translations.workflowTags }}</th>
                                <th class="has-text-centered">{{ translations.workflowIcon }}</th>
                                <th>{{ translations.workflowExecutionSteps }}</th>
                                <th class="has-text-centered">{{ translations.edit }}</th>
                                <th class="has-text-centered">{{ translations.remove }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(workflow, index) in config.workflowOptions.workflows">
                                <td>{{ workflow.name }}</td>
                                <td>{{ workflow.description }}</td>
                                <td>
                                    <div v-if="workflow.tags.length > 0" class="tags">
                                        <span v-for="tag in workflow.tags" class="tag is-light">{{ tag }}</span>
                                    </div>
                                </td>
                                <td class="has-text-centered">
                                    <icon :icon="workflow.icon" :defaulticon="defaultWorkflowIcon"></icon>
                                </td>
                                <td>
                                    <div v-for="executionStep in workflow.executionSteps" class="tags has-addons">
                                        <span class="tag" :class="getExecutionArgumentTypeClass(executionStep.executionArgumentType)">
                                            <span class="icon"><i :class="getExecutionArgumentTypeIcon(executionStep.executionArgumentType)"></i></span>
                                        </span>
                                        <span class="tag is-dark">{{ executionStep.executionArgument }}</span>
                                    </div>
                                </td>
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
