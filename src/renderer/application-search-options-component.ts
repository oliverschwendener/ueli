import Vue from "vue";
import { UserConfigOptions } from "../common/config/user-config-options";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";

export const applicationSearchOptionsComponent = Vue.extend({
    data() {
        return {
            newApplicationFolder: "",
        };
    },
    methods: {
        addApplicationFolder() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFolders.push(this.newApplicationFolder);
            this.newApplicationFolder = "";
            this.updateConfig();
        },
        removeApplicationFolder(applicationFolder: string) {
            const config: UserConfigOptions = this.config;
            const indexToRemove = config.applicationSearchOptions.applicationFolders.indexOf(applicationFolder);
            config.applicationSearchOptions.applicationFolders.splice(indexToRemove, 1);
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    props: ["config"],
    template: `
        <div class="card">
            <div class="card-body">
                <div class="card-title">Application search</div>
                <div class="card-text">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Application folder</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="applicationFolder in config.applicationSearchOptions.applicationFolders">
                            <td scope="row">
                                <input class="form-control" type="text" v-model="applicationFolder" @blur="updateConfig">
                            </td>
                            <td>
                                <button class="btn btn-danger" @click="removeApplicationFolder(applicationFolder)">Remove</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input class="form-control" v-model="newApplicationFolder">
                            </td>
                            <td>
                                <button class="btn btn-primary" @click="addApplicationFolder">Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    `,
});
