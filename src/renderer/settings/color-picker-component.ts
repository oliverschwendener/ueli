import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";

export const colorPickerComponent = Vue.extend({
    data() {
        return {
            color: "#000000",
            initialColor: "#000000",
            visible: false,
        };
    },
    methods: {
        closeModal() {
            this.visible = false;
        },
        updateValue(value: any) {
            this.color = value.hex8;
        },
        saveColor() {
            vueEventDispatcher.$emit(VueEventChannels.saveColor, this.pickerId, this.color);
            this.visible = false;
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.editColor, (pickerId: string, color: string) => {
            this.pickerId = pickerId;
            this.color = color;
            this.initialColor = color;
            this.visible = true;
        });
    },
    props: ["translations"],
    template: `
    <div class="modal" :class="{ 'is-active' : visible }">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-content slim">
            <div class="message">
                <div class="message-header">
                    <p>
                        {{ translations.colorPicker }}
                    </p>
                    <button class="delete" aria-label="delete" @click="closeModal"></button>
                </div>
                <div class="message-body">
                    <div class="field">
                        <chrome-picker :value="color" @input="updateValue"></chrome-picker>
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
                            <button class="button is-success" @click="saveColor">
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
