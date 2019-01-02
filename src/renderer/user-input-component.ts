import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import Vue from "vue";

export const userInputComponent = Vue.extend({
    data() {
        return {
            userInput: "",
        };
    },
    template: `<input type="text" v-model="userInput">`,
    watch: {
        userInput(val: string) {
            vueEventDispatcher.$emit(VueEventChannels.userInputChange, val);
        },
    },
});
