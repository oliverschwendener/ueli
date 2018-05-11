import { WebSearch } from "../../ts/web-search";

export class InputOutputCombination {
    public input: any;
    public output: any;
}

export const validWindowsFilePaths = [
    "C:\\Program Files (x86)\\Some Folder\\some-file.ext",
    "C:\\temp",
    "D:\\hello\\spaces are allowed\\and.this.is.also.valid",
];

export const invalidWindowsFilePaths = [
    "\\Program Files",
    "Program Files",
    "C:Program Files",
    "C::\\Program Files",
];

export const validMacOsFilePaths = [
    "/",
    "/Users/Hansueli",
    "/Spaces are allowed as well",
    "/and.this.is/valid-as/well",
];

export const invalidMacOsFilePaths = [
    "\\this is invalid",
    "Applications/Gugus",
    "-/Gugus",
];

export const validEmailAddresses = [
    "darth.vader@empire.com",
    "jabba-the-hutt@hutts.com",
    "lukeskywalker@rebels.com",
];

export const invalidEmailAddresses = [
    null,
    undefined,
    "",
    "  ",
    "darth.vader@",
    "darthvader",
    "darth.vader",
    "darth.vader@empire",
    "darth.vader@empire.",
    "darth.vader@mepire.c",
    "google.com",
    "https://google.com",
];

export const validUrls = [
    "google.com",
    "http://google.com",
    "https://google.com",
    "google.com/search/?query=google-something&param=value",
    "https://www.google.com/search/?query=google-something&param=value",
    "www.google.com/search/?query=google-something&param=value",
];

export const invalidUrls = [
    "",
    "google . com",
    "http://",
    "some-bullshit",
    "12340.12",
    "darth.vader@empire.cc",
];

export const dummyWebSearches = [
    {
        icon: "",
        name: "Google",
        prefix: "g",
        url: "https://google.com/query=",
    },
    {
        icon: "",
        name: "DuckDuckGo",
        prefix: "d",
        url: "https://duckduckgo.com/query=",
    },
] as WebSearch[];
