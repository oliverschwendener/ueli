import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import { UserConfirmationDialogParams } from "./user-confirmation-dialog-params";

export const userConfirmationDialog = Vue.extend({
    data() {
        return {
            confirmCallback: undefined,
            isActive: false,
            message: "",
            title: "",
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
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.settingsConfirmation, (params: UserConfirmationDialogParams) => {
            this.isActive = true;
            this.message = params.message;
            this.title = params.modalTitle;
            this.confirmCallback = params.callback;
        });
    },
    props: ["translations"],
    template: `
    <div class="modal" :class="{ 'is-active' : isActive }">
        <div class="modal-background" @click="onDeny"></div>
        <div class="modal-card">
            <div class="message">
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
