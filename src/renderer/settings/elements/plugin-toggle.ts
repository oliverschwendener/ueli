import Vue from "vue";

export const pluginToggle = Vue.extend({
    props: ["isEnabled", "toggled"],
    template: `
        <button class="button" :class="{ 'is-success' : isEnabled, 'is-danger' : !isEnabled }" @click="toggled">
            <span class="icon"><i class="fas fa-power-off"></i></span>
        </button>
    `,
});
