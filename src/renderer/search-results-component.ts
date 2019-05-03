import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { SearchResultItem } from "../common/search-result-item";
import { Icon } from "../common/icon/icon";
import { IconType } from "../common/icon/icon-type";
import { AppearanceOptions } from "../common/config/appearance-options";
import { PluginType } from "../main/plugin-type";
import { showLoaderDelay } from "./renderer-helpers";

enum BrowseDirection {
    Next = "next",
    Previous = "previous",
}

interface SearchResultItemViewModel extends SearchResultItem {
    active: boolean;
    id: string;
}

export const searchResultsComponent = Vue.extend({
    data() {
        return {
            containerId: "search-result-container",
            isLoading: false,
            loadingCompleted: true,
            searchResults: [],
        };
    },
    methods: {
        getActiveSearchResultItem(): SearchResultItemViewModel | undefined {
            const searchResults: SearchResultItemViewModel[] = this.searchResults;
            return searchResults.find((s): boolean => s.active);
        },
        getIcon(icon: Icon) {
            switch (icon.type) {
                case IconType.URL:
                    return `<img class="search-results__item-icon--url" src="${icon.parameter}">`;
                case IconType.SVG:
                    return `<div class="search-results__item-icon--svg">${icon.parameter}</div>`;
            }
        },
        update(searchResults: SearchResultItem[]) {
            let counter = 0;
            const viewModel = searchResults.map((searchResult): SearchResultItemViewModel => {
                counter++;
                return {
                    active: false,
                    description: searchResult.description,
                    executionArgument: searchResult.executionArgument,
                    hideMainWindowAfterExecution: searchResult.hideMainWindowAfterExecution,
                    icon: searchResult.icon,
                    id: `search-result-item-${counter}`,
                    name: searchResult.name,
                    originPluginType: searchResult.originPluginType,
                    searchable: searchResult.searchable,
                };
            });

            if (viewModel.length > 0) {
                viewModel[0].active = true;
            }

            this.searchResults = viewModel;
        },
        handleSearchResultBrowsing(direction: BrowseDirection): void {
            const searchResults: SearchResultItemViewModel[] = this.searchResults;
            if (searchResults.length === 0 ) {
                return;
            }

            let nextActiveIndex = 0;

            for (let i = 0; i < searchResults.length; i++) {
                if (searchResults[i].active) {
                    if (direction === BrowseDirection.Next) {
                        nextActiveIndex = i === searchResults.length - 1 ? 0 : i + 1;
                    } else {
                        nextActiveIndex = i === 0 ? searchResults.length - 1 : i - 1;
                    }
                    searchResults[i].active = false;
                    break;
                }
            }

            this.searchResults[nextActiveIndex].active = true;
            this.scrollIntoView(this.searchResults[nextActiveIndex].id);
        },
        scrollIntoView(index: string) {
            const appearanceOptions: AppearanceOptions = this.appearance;
            const scrollBehavior = appearanceOptions.smoothScrolling ? "smooth" : "auto";
            const userInput = document.getElementById("user-input");
            if (userInput !== undefined && userInput) {
                const htmlElement = document.getElementById(index);
                if (htmlElement !== undefined && htmlElement !== null) {
                    const outputContainer = document.getElementById(this.containerId);
                    if (outputContainer !== undefined && outputContainer !== null) {
                        const elementIsOutOfViewBottom = ((htmlElement.offsetTop - userInput.clientHeight) > (outputContainer.scrollTop + outputContainer.clientHeight - htmlElement.clientHeight));
                        const elementIsOutOfViewTop = htmlElement.offsetTop - userInput.clientHeight < outputContainer.scrollTop;
                        if (elementIsOutOfViewBottom) {
                            const scrollTo = htmlElement.offsetTop - userInput.clientHeight;
                            outputContainer.scrollTo({ top: scrollTo, behavior: scrollBehavior });
                        } else if (elementIsOutOfViewTop) {
                            let scrollTo = htmlElement.offsetTop - outputContainer.clientHeight - 20; // I have no idea why 20
                            if (scrollTo < 0) {
                                scrollTo = 0;
                            }
                            outputContainer.scrollTo({ top: scrollTo, behavior: scrollBehavior });
                        }
                    }
                }
            }
        },
    },
    props: ["appearance"],
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.appearanceOptionsUpdated, (appearanceOptions: AppearanceOptions) => {
            this.appearance = appearanceOptions;
        });
        vueEventDispatcher.$on(VueEventChannels.userInputChange, () => {
            this.loadingCompleted = false;

            // show loader only when loading has not completed within the given time
            setTimeout(() => {
                if (!this.loadingCompleted) {
                    this.isLoading = true;
                }
            }, showLoaderDelay);
        });
        vueEventDispatcher.$on(VueEventChannels.searchResultsUpdated, (updatedSearchResults: SearchResultItem[]) => {
            this.loadingCompleted = true;
            this.isLoading = false;
            this.update(updatedSearchResults);
        });
        vueEventDispatcher.$on(VueEventChannels.selectNextItem, () => {
            this.handleSearchResultBrowsing(BrowseDirection.Next);
        });
        vueEventDispatcher.$on(VueEventChannels.selectPreviousItem, () => {
            this.handleSearchResultBrowsing(BrowseDirection.Previous);
        });
        vueEventDispatcher.$on(VueEventChannels.enterPress, (privileged: boolean) => {
            const activeItem: SearchResultItemViewModel = this.getActiveSearchResultItem();
            if (activeItem && activeItem.originPluginType !== PluginType.None) {
                vueEventDispatcher.$emit(VueEventChannels.handleExecution, activeItem, privileged);
            }
        });
        vueEventDispatcher.$on(VueEventChannels.openSearchResultLocationKeyPress, () => {
            const activeItem: SearchResultItemViewModel = this.getActiveSearchResultItem();
            if (activeItem && activeItem.originPluginType !== PluginType.None) {
                vueEventDispatcher.$emit(VueEventChannels.handleOpenLocation, activeItem);
            }
        });
        vueEventDispatcher.$on(VueEventChannels.tabPress, () => {
            const activeItem: SearchResultItemViewModel = this.getActiveSearchResultItem();
            if (activeItem && activeItem.originPluginType !== PluginType.None) {
                vueEventDispatcher.$emit(VueEventChannels.handleAutoCompletion, activeItem);
            }
        });
    },
    template: `
        <div class="search-results" :class="{ 'scroll-disabled' : isLoading }" :id="containerId">
            <div :id="searchResult.id" class="search-results__item" :class="{ 'active' : searchResult.active }" v-for="searchResult in searchResults">
                <div class="search-results__item-icon-container">
                    <div class="search-results__item-icon-overlay" :class="{ 'active' : searchResult.active }"></div>
                    <div class="search-results__item-icon" v-html="getIcon(searchResult.icon)"></div>
                </div>
                <div class="search-results__item-info-container">
                    <div class="search-results__item-name" :class="{ 'active' : searchResult.active }">{{ searchResult.name }}</div>
                    <div class="search-results__item-description" :class="{ 'visible' : searchResult.active || appearance.showDescriptionOnAllSearchResults }">{{ searchResult.description }}</div>
                </div>
            </div>
            <div v-if="isLoading" class="search-results__overlay"></div>
        </div>
    `,
});
