import Vue from "vue";
import { IconType } from "../../common/icon/icon-type";
import { Icon } from "../../common/icon/icon";
import { isValidIcon } from "../../common/icon/icon-helpers";

export const iconComponent = Vue.extend({
    data() {
        return {
            iconTypeColor: IconType.Color,
            iconTypeSvg: IconType.SVG,
            iconTypeUrl: IconType.URL,
        };
    },
    methods: {
        getIcon(icon: Icon) {
            if (isValidIcon(icon)) {
                return icon;
            } else {
                return this.defaulticon;
            }
        },
        getBackgroundColor(icon: Icon): string {
            if (icon.type === IconType.Color) {
                return `background-color: ${icon.parameter}`;
            }
            return "";
        },
    },
    props: ["icon", "defaulticon"],
    template: `
        <div class="settings-table__icon-container">
            <img v-if="getIcon(icon).type === iconTypeUrl" :src="getIcon(icon).parameter" class="settings-table__icon-url">
            <div v-if="getIcon(icon).type === iconTypeSvg" v-html="getIcon(icon).parameter" class="settings-table__icon-svg"></div>
            <div v-if="getIcon(icon).type === iconTypeColor" :style="getBackgroundColor(icon)" class="settings-table__icon-color"></div>
        </div>
    `,
});
