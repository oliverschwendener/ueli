import Vue from "vue";
import { IconType } from "../../common/icon/icon-type";
import { TranslationSet } from "../../common/translation/translation-set";

export const iconEditingComponent = Vue.extend({
    data() {
        return {
            iconTypes: Object.keys(IconType),
        };
    },
    methods: {
        getIconTypePlaceholder(iconType: IconType): string {
            const translations: TranslationSet = this.translations;
            const placeHolder = iconType === IconType.SVG
                ? "<svg>...</svg>"
                : `<img src="...">`;
            return `${translations.forExample}: ${placeHolder}`;
        },
        getIconTypeParameterLabel(iconType: IconType): string {
            const translations: TranslationSet = this.translations;
            return iconType === IconType.URL
                ? translations.shortcutSettingsEditModalImageUrl
                : translations.shortcutSettingsEditModalSvgString;
        },
    },
    props: ["title", "icon", "translations"],
    template: `
    <div class="field">
        <div class="field">
            <label class="label">
                {{ translations.iconType }}
            </label>
            <div class="field">
                <div class="control is-expanded">
                    <div class="select is-fullwidth">
                        <select v-model="icon.type">
                            <option v-for="iconType in iconTypes">{{ iconType }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="field">
            <label class="label">{{ getIconTypeParameterLabel(icon.type) }}</label>
            <div class="control is-expanded">
                <textarea class="textarea font-mono" type="text" :placeholder="getIconTypePlaceholder(icon.type)" v-model="icon.parameter">
                </textarea>
            </div>
        </div>
    </div>
    `,
});
