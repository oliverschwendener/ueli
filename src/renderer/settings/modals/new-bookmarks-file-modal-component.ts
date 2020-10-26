import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import { getFilePath } from "../../dialogs";
import { getCurrentOperatingSystem } from "../../../common/helpers/operating-system-helpers";
import { platform } from "os";
import { TranslationSet } from "../../../common/translation/translation-set";
import { OperatingSystem } from "../../../common/operating-system";
import { homedir } from "os";

const operatingSystem = getCurrentOperatingSystem(platform());

export const newBookmarksFileModalComponent = Vue.extend({
    data() {
        return {
            newBookmarksFile: "",
            visible: false,
        };
    },
    methods: {
        closeModal() {
            this.visible = false;
            this.newBookmarksFile = "";
        },
        getPlaceholder(): string {

            const translations: TranslationSet = this.translations;
            const filePath = operatingSystem === OperatingSystem.Windows
                ? `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Bookmarks`
                : `${homedir()}/Library/Application\ Support/Google/Chrome/Default/Bookmarks`;

            return `${translations.forExample}: "${filePath}"`;
        },
        openFileDialog() {
            getFilePath()
                .then((filePath) => {
                    this.newBookmarksFile = filePath;
                });
        },
        saveButtonClick() {
            vueEventDispatcher.$emit(VueEventChannels.bookmarksFileAdded, this.newBookmarksFile);
            this.closeModal();
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.openNewApplicationFolderModal, () => {
            this.visible = true;
        });
    },
    props: ["translations"],
    template: `
        <div class="modal" :class="{ 'is-active' : visible }">
            <div class="modal-background" @click="closeModal"></div>
            <div class="modal-content">
                <div class="message">
                    <div class="message-header">
                        <p>{{ translations.browserBookmarksAddNewBookmarksFile }}</p>
                        <button @click="closeModal" class="delete" aria-label="delete"></button>
                    </div>
                    <div class="message-body">
                        <div class="field">
                            <label class="label">
                                {{ translations.browserBookmarksFile }}
                            </label>
                        </div>
                        <div class="field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="newBookmarksFile" :placeholder="getPlaceholder()">
                            </div>
                            <div class="control">
                                <button class="button" @click="openFileDialog" autofocus>
                                    <span class="icon"><i class="fas fa-folder"></i></span>
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
                                <button :disabled="newBookmarksFile.length === 0" class="button is-success" @click="saveButtonClick">
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
