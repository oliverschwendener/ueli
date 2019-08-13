import Vue from "vue";
import { TranslationSet } from "../../common/translation/translation-set";

export const tagsEditingComponent = Vue.extend({
    data() {
        return {
            newTag: "",
        };
    },
    methods: {
        deleteTag(index: number) {
            this.tags.splice(index, 1);
        },
        getTagsPlaceholder(): string {
            const translation: TranslationSet = this.translations;
            return translation.shortcutSettingsTagPlaceholder;
        },
        onTagKeyPress(event: KeyboardEvent) {
            if (event.key === "Enter") {
                if (this.newTag && this.newTag.length > 0) {
                    this.tags.push(this.newTag);
                    this.newTag = "";
                }
            }
        },
    },
    props: ["fieldTitle", "tags", "translations"],
    template: `
    <div class="field">
        <label class="label">
            {{ fieldTitle }}
        </label>
        <div v-if="tags && tags.length > 0" class="tags">
            <span v-for="(tag, index) in tags" class="tag is-dark">
                {{ tag }}
                <button @click="deleteTag(index)" class="delete is-small"></button>
            </span>
        </div>
        <div class="control">
            <input class="input" type="text" v-model="newTag" :placeholder="getTagsPlaceholder()" @keyup="onTagKeyPress">
        </div>
    </div>
    `,
});
