import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import {
    SearchResultItem,
    SearchResultItemViewModel,
    createSearchResultItemViewModel,
} from "../common/search-result-item";
import { Icon } from "../common/icon/icon";
import { IconType } from "../common/icon/icon-type";
import { AppearanceOptions } from "../common/config/appearance-options";
import { PluginType } from "../main/plugin-type";
import { showLoaderDelay } from "./renderer-helpers";

enum BrowseDirection {
    Next = "next",
    Previous = "previous",
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
        getIcon(icon: Icon, active: boolean) {
            const activeClass = active ? "active" : "";
            switch (icon.type) {
                case IconType.URL:
                    return `<img class="search-results__item-icon--url ${activeClass}" src="${icon.parameter}">`;
                case IconType.SVG:
                    return `<div class="search-results__item-icon--svg ${activeClass}">${icon.parameter}</div>`;
                case IconType.Color:
                    return `<div class="search-results__item-icon--color" style="background-color: ${icon.parameter};"></div>`;
            }
        },
        update(searchResults: SearchResultItem[]) {
            let counter = 0;

            const viewModel = searchResults.map(
                (searchResult): SearchResultItemViewModel => {
                    counter++;
                    return createSearchResultItemViewModel(searchResult, counter);
                },
            );

            if (viewModel.length > 0) {
                viewModel[0].active = true;
                this.scrollIntoView(viewModel[0].id);
            }

            this.searchResults = viewModel;
        },
        handleSearchResultPageBrowsing(direction: BrowseDirection): void {
            const searchResults: SearchResultItemViewModel[] = this.searchResults;
            if (searchResults.length === 0 )
                return;

            const activeSearchResult = searchResults.find(r => r.active);
            if (activeSearchResult === undefined)
                return;

            const activeSearchResultIndex = searchResults.indexOf(activeSearchResult);
            const firstVisibleSearchResultIndex = this.getIndexOfFirstVisibleSearchResult();
            const lastVisibleSearchResultIndex = this.getIndexOfLastVisibleSearchResult();

            let nextActiveIndex = 0;
            const appearanceOptions: AppearanceOptions = this.appearance;
            const maxSearchResultsPerPage = Number(appearanceOptions.maxSearchResultsPerPage);
            if (direction === BrowseDirection.Next) {
                nextActiveIndex = activeSearchResultIndex >= firstVisibleSearchResultIndex && activeSearchResultIndex < lastVisibleSearchResultIndex
                    ? lastVisibleSearchResultIndex
                    : activeSearchResultIndex + maxSearchResultsPerPage;
            } else {
                nextActiveIndex = activeSearchResultIndex > firstVisibleSearchResultIndex && activeSearchResultIndex <= lastVisibleSearchResultIndex
                    ? firstVisibleSearchResultIndex
                    : activeSearchResultIndex - maxSearchResultsPerPage;
            }

            if (nextActiveIndex < 0)
                nextActiveIndex = 0;
            else if (nextActiveIndex >= searchResults.length)
                nextActiveIndex = searchResults.length - 1;

            activeSearchResult.active = false;
            searchResults[nextActiveIndex].active = true;
            this.scrollIntoView(searchResults[nextActiveIndex].id);
        },
        getIndexOfFirstVisibleSearchResult(): number {
            const searchResultsContainer = document.getElementById(this.containerId);
            if (searchResultsContainer == null)
                return 0;

            const appearanceOptions: AppearanceOptions = this.appearance;
            return Math.ceil(searchResultsContainer.scrollTop / appearanceOptions.searchResultHeight);
        },
        getIndexOfLastVisibleSearchResult(): number {
            const searchResultsContainer = document.getElementById(this.containerId);
            if (searchResultsContainer == null)
                return 0;

            const appearanceOptions: AppearanceOptions = this.appearance;
            return Math.floor((searchResultsContainer.scrollTop + searchResultsContainer.clientHeight) / appearanceOptions.searchResultHeight) - 1;
        },
        handleSearchResultBrowsing(direction: BrowseDirection): void {
            const searchResults: SearchResultItemViewModel[] = this.searchResults;
            if (searchResults.length === 0) {
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

            searchResults[nextActiveIndex].active = true;
            this.scrollIntoView(searchResults[nextActiveIndex].id);
        },
        scrollIntoView(elementId: string) {
            const appearanceOptions: AppearanceOptions = this.appearance;
            const scrollBehavior = appearanceOptions.smoothScrolling ? "smooth" : "auto";
            const htmlElement = document.getElementById(elementId);
            const searchResultsContainer = document.getElementById(this.containerId);
            if (!htmlElement || !searchResultsContainer)
                return;

            const elementIsOutOfViewBottom =
                (htmlElement.offsetTop + htmlElement.clientHeight) > (searchResultsContainer.scrollTop + searchResultsContainer.clientHeight);
            const elementIsOutOfViewTop = htmlElement.offsetTop < searchResultsContainer.scrollTop;
            if (elementIsOutOfViewBottom || elementIsOutOfViewTop) {
                const scrollTo = Math.floor(htmlElement.offsetTop / searchResultsContainer.clientHeight) * searchResultsContainer.clientHeight;
                searchResultsContainer.scrollTo({ top: scrollTo, behavior: scrollBehavior });
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
        vueEventDispatcher.$on(VueEventChannels.pageDownPress, () => {
            this.handleSearchResultPageBrowsing(BrowseDirection.Next);
        });
        vueEventDispatcher.$on(VueEventChannels.pageUpPress, () => {
            this.handleSearchResultPageBrowsing(BrowseDirection.Previous);
        });
        vueEventDispatcher.$on(
            VueEventChannels.enterPress,
            (userInput: string, privileged: boolean, userConfirmed?: boolean) => {
                const activeItem: SearchResultItemViewModel = this.getActiveSearchResultItem();
                if (activeItem && activeItem.originPluginType !== PluginType.None) {
                    if (activeItem.needsUserConfirmationBeforeExecution && !userConfirmed) {
                        vueEventDispatcher.$emit(VueEventChannels.userConfirmationRequested);
                    } else {
                        vueEventDispatcher.$emit(VueEventChannels.handleExecution, userInput, activeItem, privileged);
                    }
                }
            },
        );
        vueEventDispatcher.$on(VueEventChannels.openSearchResultLocationKeyPress, () => {
            const activeItem: SearchResultItemViewModel = this.getActiveSearchResultItem();
            if (activeItem && activeItem.supportsOpenLocation && activeItem.originPluginType !== PluginType.None) {
                vueEventDispatcher.$emit(VueEventChannels.handleOpenLocation, activeItem);
            }
        });
        vueEventDispatcher.$on(VueEventChannels.tabPress, () => {
            const activeItem: SearchResultItemViewModel = this.getActiveSearchResultItem();
            if (activeItem && activeItem.supportsAutocompletion && activeItem.originPluginType !== PluginType.None) {
                vueEventDispatcher.$emit(VueEventChannels.handleAutoCompletion, activeItem);
            }
        });
    },
    template: `
        <div class="search-results" :class="{ 'scroll-disabled' : isLoading }" :id="containerId">
            <div :id="searchResult.id" class="search-results__item" :class="{ 'active' : searchResult.active }" v-for="searchResult in searchResults">
                <div class="search-results__item-icon-container" :class="{ 'active' : searchResult.active }">
                    <div class="search-results__item-icon" v-html="getIcon(searchResult.icon, searchResult.active)"></div>
                </div>
                <div class="search-results__item-info-container">
                    <div class="search-results__item-name" :class="{ 'active' : searchResult.active }">{{ searchResult.name }}</div>
                    <div class="search-results__item-description" :class="{ 'visible' : searchResult.active || appearance.showDescriptionOnAllSearchResults, 'active' : searchResult.active }">{{ searchResult.description }}</div>
                </div>
                <div v-if="appearance.showSearchResultNumbers" class="search-results__item-number-container" :class="{ 'active' : searchResult.active }">#{{ searchResult.resultNumber }}</div>
            </div>
            <div v-if="isLoading" class="search-results__overlay"></div>
        </div>
    `,
});
