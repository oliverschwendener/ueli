import { WebSearchEngine } from "../../main/plugins/websearch-plugin/web-search-engine";
import { IconType } from "../icon/icon-type";

export interface WebSearchOptions {
    isEnabled: boolean;
    webSearchEngines: WebSearchEngine[];
}

export const defaultWebSearchOptions: WebSearchOptions = {
    isEnabled: true,
    webSearchEngines: [
        {
            encodeSearchTerm: true,
            icon: {
                parameter: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="m44 24c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20z" fill="#ff3d00"/><g fill="#fff"><path d="m24 42c-9.9 0-18-8.1-18-18s8.1-18 18-18 18 8.1 18 18-8.1 18-18 18zm0-34c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16z"/><path d="m23.5 15.1c-2-2.1-5.5-2.7-8-2.3.2 0 1 .4 1.6.6-.9.2-1.2.6-1.6 1.1 1.3-.1 3.2 0 4.6.4-4.9.5-5.9 4.4-5.4 7.8.5 2.7 2.4 11.6 3.4 16.5 1.9.8 6.9 1.8 8.9.7-.5-1-1.1-2.1-1.5-2.8-1.2-2.5-2.5-5.9-1.9-8.1l.4-2.3 4.7-2.3c.3-3.9-1-8.4-5.2-9.3z"/></g><g fill="#0277bd"><path d="m16.8 20.1s-.4-.9.8-1.5c.9-.4 1.7.3 1.7.3-1.3-.2-1.9-.1-2.5 1.2zm8.2-1.2s.4-1.3 1.5-.9c.6.2.9.8.9.8-.9-.6-1.5-.4-2.4.1z"/><path d="m19 21.1a1.2 1.2 0 00-1.2 1.2 1.2 1.2 0 001.2 1.2 1.2 1.2 0 001.2-1.2 1.2 1.2 0 00-1.2-1.2zm.5.5a.3.3 0 01.3.3.3.3 0 01-.3.3.3.3 0 01-.3-.3.3.3 0 01.3-.3z"/><path d="m26.8 20.6a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1zm.4.3a.3.3 0 010 0 .3.3 0 01.3.3.3.3 0 01-.3.3.3.3 0 01-.3-.3.3.3 0 01.3-.3z"/></g><path d="m25.6 24.6c1.3-.1 1.7-.1 2.8-.3 1.1-.3 3.9-1 4.7-1.3.9-.4 4.1.2 1.8 1.5-1 .6-3.7 1.6-5.7 2.2-1.9.6-3.1-.6-3.8.4-.5.8-.1 1.8 2.2 2 3.1.3 6.2-1.4 6.5-.5s-2.7 2.1-4.6 2.1c-1.8 0-5.6-1.2-6.1-1.6s-1.2-1.3-1.1-2.3c.1-.7 2-2.1 3.3-2.2z" fill="#ffca28"/><path d="m23.3 35.7s-4.3-2.3-4.4-1.4 0 4.7.5 5 4.1-1.9 4.1-1.9zm1.7-.1s2.9-2.2 3.6-2.1c.6.1.8 4.7.2 4.9s-3.9-1.2-3.9-1.2z" fill="#8bc34a"/><path d="m22.9 38c.6.1 1.9 0 2.3-.3s.1-2.2-.1-2.6c-.1-.3-2.6 0-2.6.6 0 1.5-.2 2.1.4 2.3z" fill="#689f38"/></svg>`,
                type: IconType.SVG,
            },
            isFallback: false,
            name: "DuckDuckGo",
            prefix: "d?",
            priority: 1,
            url: "https://duckduckgo.com/?q={{query}}",
            suggestionUrl: "https://ac.duckduckgo.com/ac/?q={{query}}&type=list",
        },
        {
            encodeSearchTerm: true,
            icon: {
                parameter: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="m6.3 14.7 6.6 4.8c1.8-4.4 6.1-7.5 11.1-7.5 3.1 0 5.9 1.1 8 3l5.6-5.6c-3.6-3.3-8.3-5.4-13.6-5.4-7.7 0-14.3 4.3-17.7 10.7z" fill="#ff3d00"/><path d="m12.7 28.1c-.5-1.3-.7-2.7-.7-4.1 0-1.6.3-3.1.9-4.5l-6.6-4.8c-1.5 2.8-2.3 5.9-2.3 9.3 0 3.3.8 6.4 2.2 9.1z" fill="#ffc107"/><path d="m24 44c5.2 0 9.8-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5c3.3 6.5 10 10.9 17.8 10.9z" fill="#4caf50"/><path d="m43.6 20h-19.6v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.7-.4-4z" fill="#1976d2"/></svg>`,
                type: IconType.SVG,
            },
            isFallback: false,
            name: "Google",
            prefix: "g?",
            priority: 2,
            url: "https://google.com/search?q={{query}}",
            suggestionUrl: "https://www.google.com/complete/search?client=opera&q={{query}}",
        },
        {
            encodeSearchTerm: true,
            icon: {
                parameter: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="m14 13-10 11h15c2.5 0 5-2.5 5-5v-6z" fill="#ffc107"/><path d="m14 13 8.9 8.9c.7-.9 1.1-1.9 1.1-2.9v-6z" fill="#ff9800"/><path d="m35 14-11-10v15c0 2.5 2.5 5 5 5h6z" fill="#f44336"/><path d="m35 14-8.9 8.9c.9.7 1.9 1.1 2.9 1.1h6z" fill="#ad1457"/><path d="m34 35 10-11h-15c-2.5 0-5 2.5-5 5v6z" fill="#448aff"/><path d="m34 35-8.9-8.9c-.7.9-1.1 1.9-1.1 2.9v6z" fill="#1565c0"/><path d="m13 34 11 10v-15c0-2.5-2.5-5-5-5h-6z" fill="#8bc34a"/><path d="m13 34 8.9-8.9c-.9-.7-1.9-1.1-2.9-1.1h-6z" fill="#009688"/></svg>`,
                type: IconType.SVG,
            },
            isFallback: false,
            name: "Google Images",
            prefix: "gi?",
            priority: 3,
            url: "https://www.google.com/search?tbm=isch&q={{query}}",
            suggestionUrl: "https://www.google.com/complete/search?ds=i&output=firefox&q={{query}}",
        },
        {
            encodeSearchTerm: true,
            icon: {
                parameter: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="m44 13h-2.8l-10.9 24h-.8l-5.2-10.5-5.6 10.5h-.8l-11-24h-2.9v-2h9.8v2h-2.4l7.6 18.1 4-7.4-5-10.7h-1.7v-2h7.5v2h-1.7l2.9 6.9 3.5-6.9h-2.6v-2h7.3v2h-1.9l-5 9.7 4.1 8.4 7.9-18.1h-3v-2h8.7z"/></svg>`,
                type: IconType.SVG,
            },
            isFallback: false,
            name: "Wikipedia",
            prefix: "w?",
            priority: 4,
            url: "https://en.wikipedia.org/wiki/{{query}}",
            suggestionUrl: "https://en.wikipedia.org/w/api.php?action=opensearch&search={{query}}",
        },
        {
            encodeSearchTerm: true,
            icon: {
                parameter: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="m24 9s-12.4.2-15.5 1c-1.7.5-3 1.8-3.5 3.5-.8 3.1-1 10.5-1 10.5s.2 7.4 1 10.5c.5 1.7 1.8 3 3.5 3.5 3.1.8 15.5 1 15.5 1s12.4-.2 15.5-1c1.7-.5 3-1.8 3.5-3.5.8-3.1 1-10.5 1-10.5s-.2-7.4-1-10.5c-.5-1.7-1.8-3-3.5-3.5-3.1-.8-15.5-1-15.5-1z" fill="#f60d07"/><path d="m18 17 12 7-12 7z" fill="#fff"/></svg>`,
                type: IconType.SVG,
            },
            isFallback: false,
            name: "YouTube",
            prefix: "yt?",
            priority: 5,
            url: "https://www.youtube.com/results?search_query={{query}}",
            suggestionUrl: "https://www.google.com/complete/search?ds=yt&output=firefox&q={{query}}",
        },
        {
            encodeSearchTerm: true,
            icon: {
                parameter: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="m8 4 9.2 2.8v22.6l-8.7 7.8 21.3-11.2-5.9-2.8-4.1-8.9 20.2 6.2v9.9l-22.9 13.6-9.1-6.4z" fill="#f4bd27"/></svg>`,
                type: IconType.SVG,
            },
            isFallback: false,
            name: "Bing",
            prefix: "b?",
            priority: 6,
            url: "https://www.bing.com/search?q={{query}}",
            suggestionUrl: "https://www.bing.com/osjson.aspx?query={{query}}",
        },
    ],
};
