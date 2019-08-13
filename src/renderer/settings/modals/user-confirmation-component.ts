import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./user-confirmation-dialog-params";

export const userConfirmationDialog = Vue.extend({
    data() {
        return {
            confirmCallback: undefined,
            isActive: false,
            message: "",
            title: "",
            type: UserConfirmationDialogType.Default,
        };
    },
    methods: {
        onConfirm() {
            if (this.confirmCallback && typeof this.confirmCallback === "function") {
                this.confirmCallback();
            }
            this.onDeny();
        },
        onDeny() {
            this.isActive = false;
            this.message = "";
            this.title = "";
            this.confirmCallback = undefined;
            this.type = "";
        },
        getMessageTypeClass(type: UserConfirmationDialogType): string {
            switch (type) {
                case UserConfirmationDialogType.Error:
                    return "is-danger";
                case UserConfirmationDialogType.Default:
                default:
                    return "";
            }
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.settingsConfirmation, (params: UserConfirmationDialogParams) => {
            this.isActive = true;
            this.message = params.message;
            this.title = params.modalTitle;
            this.confirmCallback = params.callback;

            if (params.type) {
                this.type = params.type;
            }
        });
    },
    props: ["translations"],
    template: `
    <div class="modal" :class="{ 'is-active' : isActive }">
        <div class="modal-background" @click="onDeny"></div>
        <div class="modal-card">
            <div class="message" :class="getMessageTypeClass(type)">
                <div class="message-header">
                    <p>{{ title }}</p>
                    <button class="delete" aria-label="delete" @click="onDeny"></button>
                </div>
                <div class="message-body">
                    <div class="field">
                        {{ message }}
                    </div>
                    <div class="field has-text-centered">
                        <button class="button is-success" @click="onConfirm">{{ translations.yes }}</button>
                        <button class="button is-danger" @click="onDeny">{{ translations.no }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
});
