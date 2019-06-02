import { SearchResultItem } from "../../../common/search-result-item";
import {promisify} from "util";
import { normalize, basename } from "path";
import { getFileIconDataUrl } from "../../../common/icon/generate-file-icon";
import { MdFindOptions } from "../../../common/config/mdfind-options";
import { PluginType } from "../../plugin-type";
import { Icon } from "../../../common/icon/icon";
import { defaultFolderIcon } from "../../../common/icon/default-icons";
const exec = promisify(require("child_process").exec); // tslint:disable-line

export class MdFindSearcher {
    public static async search(searchTerm: string, mdfindOptions: MdFindOptions, pluginType: PluginType, defaultIcon: Icon): Promise<SearchResultItem[]> {
        try {
            const {stdout, stderr, mdfindError} = await exec(`mdfind -name ${searchTerm} | head -n ${mdfindOptions.maxSearchResults}`);
            if (mdfindError) {
                return mdfindError;
            } else if (stderr)  {
                return stderr;
            } else {
                const filePaths = stdout
                    .split("\n")
                    .map((f: string) => normalize(f).trim())
                    .filter((f: string) => f !== ".");

                const results = this.handleFilePaths(filePaths, pluginType, defaultIcon);
                return results;

            }
        } catch (error) {
            return error;
        }
    }

    private static async handleFilePaths(filePaths: string[], pluginType: PluginType, defaultIcon: Icon): Promise<SearchResultItem[]> {
        if (filePaths.length === 0) {return []; }
        try {
            const icons = await Promise.all(filePaths.map((f) => getFileIconDataUrl(f, defaultIcon, defaultFolderIcon)));
            const results = icons.map((icon): SearchResultItem => {
                return {
                    description: icon.filePath,
                    executionArgument: icon.filePath,
                    hideMainWindowAfterExecution: true,
                    icon: icon.icon,
                    name: basename(icon.filePath),
                    originPluginType: pluginType,
                    searchable: [],
                };
            });
            return results;

        } catch (iconError) {
            return iconError;
        }
    }
}
