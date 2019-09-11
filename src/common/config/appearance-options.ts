export interface AppearanceOptions {
    maxSearchResultsPerPage: number;
    searchResultHeight: number;
    showDescriptionOnAllSearchResults: boolean;
    showSearchIcon: boolean;
    showSearchResultNumbers: boolean;
    smoothScrolling: boolean;
    userInputHeight: number;
    windowWidth: number;
    allowTransparentBackground: boolean;
}

export const defaultAppearanceOptions: AppearanceOptions = {
    allowTransparentBackground: false,
    maxSearchResultsPerPage: 8,
    searchResultHeight: 50,
    showDescriptionOnAllSearchResults: true,
    showSearchIcon: true,
    showSearchResultNumbers: false,
    smoothScrolling: true,
    userInputHeight: 60,
    windowWidth: 600,
};
