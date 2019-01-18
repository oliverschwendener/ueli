import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import Vue from "vue";
import { ipcRenderer } from "electron";
import { IpcChannels } from "../common/ipc-channels";

export const userInputComponent = Vue.extend({
    data() {
        return {
            stylesheet: "./styles/user-input.css",
            userInput: "",
        };
    },
    methods: {
        onKeyPress(event: KeyboardEvent): void {
            if (event.key === "ArrowUp") {
                event.preventDefault();
                vueEventDispatcher.$emit(VueEventChannels.selectPreviousItem);
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                vueEventDispatcher.$emit(VueEventChannels.selectNextItem);
            }

            if (event.key === "Enter") {
                vueEventDispatcher.$emit(VueEventChannels.enterPress);
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "i") {
                ipcRenderer.send(IpcChannels.openSettingsWindow);
            }
        },
        resetUserInput(): void {
            this.userInput = "";
        },
        setFocusOnInput(): void {
            const userInput = document.getElementById("user-input");
            if (userInput !== null) {
                userInput.focus();
            }
        },
    },
    mounted() {
        this.setFocusOnInput();

        vueEventDispatcher.$on(VueEventChannels.mainWindowHasBeenHidden, () => {
            this.resetUserInput();
        });

        vueEventDispatcher.$on(VueEventChannels.mainWindowHasBeenShown, () => {
            this.setFocusOnInput();
        });
    },
    template: `
        <div id="user-input" class="user-input">
            <input autofocus id="user-input" class="user-input__input" type="text" v-model="userInput" @keydown="onKeyPress">
        </div>
        `,
    watch: {
        userInput(val: string) {
            vueEventDispatcher.$emit(VueEventChannels.userInputChange, val);
        },
    },
});
