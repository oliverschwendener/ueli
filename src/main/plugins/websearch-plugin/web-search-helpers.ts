import { WebSearchEngine } from "./web-search-engine";
import { IconType } from "../../../common/icon/icon-type";
import { IconHelpers } from "../../../common/icon/icon-helpers";

export const defaultNewWebSearchEngine: WebSearchEngine = {
    encodeSearchTerm: true,
    icon: {
        parameter: "",
        type: IconType.URL,
    },
    isFallback: false,
    name: "",
    prefix: "",
    priority: 0,
    url: "",
};

export function isValidForAdd(websearchEngine: WebSearchEngine): boolean {
    const iconCondition = websearchEngine.icon.parameter && websearchEngine.icon.parameter.length > 0
        ? IconHelpers.isValidIconParameter(websearchEngine.icon)
        : true;

    return websearchEngine !== undefined
        && websearchEngine.name.length > 0
        && websearchEngine.url.length > 0
        && (websearchEngine.url.startsWith("http://") || websearchEngine.url.startsWith("https://"))
        && websearchEngine.url.indexOf("{{query}}") > -1
        && iconCondition;
}
