export class Config {
    private userInputHeight = 80;
    private searchResultHeight = 60;

    public windowWith = 860;
    public maxSearchResultCount = 8;
    public minWindowHeight = this.userInputHeight;
    public maxWindowHeight = this.userInputHeight + (this.maxSearchResultCount * this.searchResultHeight);

    public calculateWindowHeight(searchResultCount: number): number {
        return searchResultCount >= this.maxSearchResultCount
            ? this.maxWindowHeight
            : this.minWindowHeight + (searchResultCount * this.searchResultHeight);
    }
}