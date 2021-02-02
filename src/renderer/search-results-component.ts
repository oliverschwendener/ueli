import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { SearchResultItem, SearchResultItemViewModel, createSearchResultItemViewModel } from "../common/search-result-item";
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
            ctrlPressed: false,
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

            const viewModel = searchResults.map((searchResult): SearchResultItemViewModel => {
                counter++;
                return createSearchResultItemViewModel(searchResult, counter);
            });

            if (viewModel.length > 0) {
                viewModel[0].active = true;
            }

            this.searchResults = viewModel;
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
                            const scrollTo = htmlElement.offsetTop - userInput.clientHeight + 30;
                            outputContainer.scrollTo({ top: scrollTo, behavior: scrollBehavior });
                        } else if (elementIsOutOfViewTop) {
                            let scrollTo = htmlElement.offsetTop - outputContainer.clientHeight + 50;
                            if (scrollTo < 0) {
                                scrollTo = 0;
                            }
                            outputContainer.scrollTo({ top: scrollTo, behavior: scrollBehavior });
                        }
                    }
                }
            }
        },
        handleMouseClick(index: number, event: MouseEvent) {
            vueEventDispatcher.$emit(VueEventChannels.mouseClick, index, event.shiftKey);
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
        vueEventDispatcher.$on(VueEventChannels.enterPress, (userInput: string, privileged: boolean, userConfirmed?: boolean) => {
            const activeItem: SearchResultItemViewModel = this.getActiveSearchResultItem();
            if (activeItem && activeItem.originPluginType !== PluginType.None) {
                if (activeItem.needsUserConfirmationBeforeExecution && !userConfirmed) {
                    vueEventDispatcher.$emit(VueEventChannels.userConfirmationRequested);
                } else {
                    vueEventDispatcher.$emit(VueEventChannels.handleExecution, userInput, activeItem, privileged);
                }
            }
        });
        vueEventDispatcher.$on(VueEventChannels.executeMouseClick, (userInput: string, index: number, privileged: boolean, userConfirmed?: boolean) => {
            const clickedItem: SearchResultItem = this.searchResults[index];
            if (clickedItem && clickedItem.originPluginType !== PluginType.None) {
                if (clickedItem.needsUserConfirmationBeforeExecution && !userConfirmed) {
                    vueEventDispatcher.$emit(VueEventChannels.userConfirmationRequested);
                } else {
                    vueEventDispatcher.$emit(VueEventChannels.handleExecution, userInput, clickedItem, privileged);
                }
            }
        }
        );
        vueEventDispatcher.$on(VueEventChannels.ctrlNumberExecute, (userInput: string, index: number, privileged: boolean, userConfirmed?: boolean) => {
            const chosenItem = this.searchResults[index];
            if (chosenItem && chosenItem.originPluginType !== PluginType.None) {
                if (chosenItem.needsUserConfirmationBeforeExecution && !userConfirmed) {
                    vueEventDispatcher.$emit(VueEventChannels.userConfirmationRequested);
                } else {
                    vueEventDispatcher.$emit(VueEventChannels.handleExecution, userInput, chosenItem, privileged);
                }
            }
        });
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
        vueEventDispatcher.$on(VueEventChannels.ctrlPressed, (value: boolean) => {
            this.ctrlPressed = value
        });
    },
    template: `
        <div class="search-results" :class="{ 'scroll-disabled' : isLoading }" :id="containerId">
        <div :id="searchResult.id" class="search-results__item" :class="{ 'active' : searchResult.active }" v-for="(searchResult,index) in searchResults" @click="handleMouseClick(index,$event)">
                <div class="search-results__item-icon-container" :class="{ 'active' : searchResult.active }">
                    <div class="search-results__item-icon" v-html="getIcon(searchResult.icon, searchResult.active)"></div>
                </div>
                <div class="search-results__item-info-container">
                    <div class="search-results__item-name" :class="{ 'active' : searchResult.active }">{{ searchResult.name }}</div>
                    <div class="search-results__item-description" :class="{ 'visible' : searchResult.active || appearance.showDescriptionOnAllSearchResults, 'active' : searchResult.active }">{{ searchResult.description }}</div>
                </div>
                <div v-if="appearance.showSearchResultNumbers || ctrlPressed" class="search-results__item-number-container" :class="{ 'active' : searchResult.active }">#{{ searchResult.resultNumber }}</div>
            </div>
            <div v-if="isLoading" class="search-results__overlay"></div>
        </div>
    `,
});
