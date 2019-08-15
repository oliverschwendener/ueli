import Vue from "vue";
import { IconType } from "../../common/icon/icon-type";
import { TranslationSet } from "../../common/translation/translation-set";
import { getIconTypeLabel } from "../../common/icon/icon-helpers";

export const iconEditingComponent = Vue.extend({
    data() {
        return {
            iconTypes: Object.values(IconType),
        };
    },
    methods: {
        getIconTypePlaceholder(iconType: IconType): string {
            const translations: TranslationSet = this.translations;
            let placeHolder = "";
            switch (iconType) {
                case IconType.Color:
                    placeHolder = "#fff";
                    break;
                case IconType.SVG:
                    placeHolder = "<svg>...</svg>";
                    break;
                case IconType.URL:
                    placeHolder = `<img src="...">`;
                    break;
            }
            return `${translations.forExample}: ${placeHolder}`;
        },
        getIconTypeParameterLabel(iconType: IconType): string {
            const translations: TranslationSet = this.translations;
            switch (iconType) {
                case IconType.Color:
                    return translations.shortcutSettingsEditModalColor;
                case IconType.SVG:
                    return translations.shortcutSettingsEditModalSvgString;
                case IconType.URL:
                    return translations.shortcutSettingsEditModalImageUrl;
            }
        },
        getIconTypeLabel(iconType: IconType): string {
            const translations: TranslationSet = this.translations;
            return getIconTypeLabel(iconType, translations);
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
                            <option v-for="iconType in iconTypes" :value="iconType">
                                {{ getIconTypeLabel(iconType) }}
                            </option>
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
