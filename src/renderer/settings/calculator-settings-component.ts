import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultCalculatorOptions, CalculatorOptions } from "../../common/config/calculator-options";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";
import { NotificationType } from "../../common/notification-type";

export const calculatorSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.Calculator,
            visible: false,
            decimalSeparator: ".",
            argumentSeparator: ",",
            savedDecimalSeparator: ".",
            savedArgumentSeparator: ",",
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.calculatorOptions.isEnabled = !config.calculatorOptions.isEnabled;
            this.updateConfig();
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.calculatorOptions = deepCopy(defaultCalculatorOptions);
                    this.decimalSeparator = defaultCalculatorOptions.decimalSeparator;
                    this.argumentSeparator = defaultCalculatorOptions.argumentSeparator;
                    this.updateConfig();
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        updateConfig() {
            const translations: TranslationSet = this.translations;
            if (this.decimalSeparator === this.argumentSeparator)
                vueEventDispatcher.$emit(VueEventChannels.notification, translations.calculatorDecimalSeparatorMustNotEqualArgumentSeparator, NotificationType.Error);
            else {
                const calcConfig: CalculatorOptions = this.config.calculatorOptions;
                calcConfig.decimalSeparator = this.decimalSeparator;
                calcConfig.argumentSeparator = this.argumentSeparator;
                this.savedDecimalSeparator = calcConfig.decimalSeparator;
                this.savedArgumentSeparator = calcConfig.argumentSeparator;
                vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
            }
        },
        setDecimalSeparator(separator: string) {
            this.decimalSeparator = separator;
            this.updateConfig();
        },
        setArgumentSeparator(separator: string) {
            this.argumentSeparator = separator;
            this.updateConfig();
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (settingName === this.settingName) {
                const calcConfig: CalculatorOptions = this.config.calculatorOptions;
                this.decimalSeparator = calcConfig.decimalSeparator;
                this.argumentSeparator = calcConfig.argumentSeparator;
                this.savedDecimalSeparator = calcConfig.decimalSeparator;
                this.savedArgumentSeparator = calcConfig.argumentSeparator;
                this.visible = true;
            } else {
                this.visible = false;
            }
        });
    },
    props: ["config", "translations"],
    template: `
    <div v-if="visible">
        <div class="settings__setting-title title is-3">
            <span>
                {{ translations.calcuator }}
            </span>
            <div>
                <plugin-toggle :is-enabled="config.calculatorOptions.isEnabled" :toggled="toggleEnabled"/>
                <button v-if="config.calculatorOptions.isEnabled" class="button" @click="resetAll">
                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                </button>
            </div>
        </div>
        <p class="settings__setting-description" v-html="translations.calculatorDescription"></p>
        <div class="settings__setting-content">
            <div v-if="!config.calculatorOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__option-container">

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.calculatorPrecision }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input
                                            type="number"
                                            class="input"
                                            min="1"
                                            v-model="config.calculatorOptions.precision"
                                            @change="updateConfig"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.calculatorDecimalSeparator }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="buttons has-addons">
                                        <button class="button"
                                            :class="{ 'is-success' : decimalSeparator == '.' }"
                                            @click="setDecimalSeparator('.')">.</button>
                                        <button class="button"
                                            :class="{ 'is-success' : decimalSeparator == ',' && argumentSeparator != ',',
                                                'is-danger': decimalSeparator == ',' && argumentSeparator == ',' }"
                                            @click="setDecimalSeparator(',')">,</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.calculatorArgumentSeparator }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="buttons has-addons">
                                        <button class="button"
                                            :class="{ 'is-success' : argumentSeparator == ',' && decimalSeparator != ',',
                                                'is-danger': argumentSeparator == ',' && decimalSeparator == ',' }"
                                            @click="setArgumentSeparator(',')">,</button>
                                        <button class="button"
                                            :class="{ 'is-success' : argumentSeparator == ';' }"
                                            @click="setArgumentSeparator(';')">;</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>{{ translations.example }}: sum(1{{config.calculatorOptions.decimalSeparator}}2{{config.calculatorOptions.argumentSeparator}} 3) = 4{{config.calculatorOptions.decimalSeparator}}2</div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
});
