import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { showNotification } from "./notifications";
import { SettingsNotificationType } from "./settings-notification-type";
import { isWindows } from "../common/helpers/operating-system-helpers";
import { platform } from "os";

export const newApplicationFileExtensionModalComponent = Vue.extend({
    data() {
        return {
            newApplicationFileExtension: "",
            visible: false,
        };
    },
    methods: {
        closeModal() {
            this.newApplicationFileExtension = "";
            this.visible = false;
        },
        getPlaceholder(): string {
            const ext = isWindows(platform())
                ? ".lnk"
                : ".app";

            return `For example: "${ext}"`;
        },
        saveButtonClick() {
            const applicationFileExtension: string = this.newApplicationFileExtension;
            const isValidApplicationFileExtension = applicationFileExtension !== undefined
                && applicationFileExtension.startsWith(".")
                && applicationFileExtension.replace(".", "").length > 0;

            if (isValidApplicationFileExtension) {
                vueEventDispatcher.$emit(VueEventChannels.applicationFileExtensionAdded, applicationFileExtension);
                this.closeModal();
            } else {
                showNotification(`"${applicationFileExtension}" is not a valid file extension`, SettingsNotificationType.Error);
            }
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.openNewApplicationFileExtensionModal, () => {
            this.visible = true;
        });
    },
    template: `
        <div class="modal" :class="{ 'is-active' : visible }">
            <div class="modal-background" @click="closeModal"></div>
                <div class="modal-content">
                    <div class="message">
                    <div class="message-header">
                        <p>Add new application folder</p>
                        <button @click="closeModal" class="delete" aria-label="delete"></button>
                    </div>
                    <div class="message-body">
                        <div class="field">
                            <label class="label">
                                Application file extension
                            </label>
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="newApplicationFileExtension" autofocus :placeholder="getPlaceholder()">
                            </div>
                        </div>
                        <div class="field is-grouped is-grouped-right">
                            <div class="control">
                                <button class="button is-danger" @click="closeModal">
                                    <span class="icon">
                                        <i class="fas fa-times"></i>
                                    </span>
                                    <span>Cancel</span>
                                </button>
                            </div>
                            <div class="control">
                                <button :disabled="newApplicationFileExtension.length === 0" class="button is-success" @click="saveButtonClick">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
