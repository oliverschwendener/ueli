export enum PluginType {
    ApplicationSearchPlugin = "application-search-plugin",
    UeliCommandSearchPlugin = "ueli-command-search-plugin",
    ShortcutsSearchPlugin = "shortcuts-search-plugin",
    EverythingSearchPlugin = "everything-search-plugin",
    MdFindExecutionPlugin = "md-find-execution-plugin",
    TranslationPlugin = "translation-plugin",
    WebSearchPlugin = "websearch-plugin",
    FileBrowserPlugin = "filebrowser-plugin",
    OperatingSystemCommandsPlugin = "operating-system-commands-plugin",
    OperatingSystemSettingsPlugin = "operating-system-settings-plugin",
    Calculator = "calculator-plugin",
    Url = "url-plugin",
    Email = "email-plugin",
    CurrencyConverter = "currency-converter-plugin",
    Workflow = "workflow-plugin",
    Commandline = "commandline-plugin",
    SimpleFolderSearch = "simple-folder-search-plugin",
    Uwp = "uwp",
    ColorConverter = "color-converter",
    Dictionary = "dictionary",
    BrowserBookmarks = "browser-bookmarks",
    ControlPanel = "control-panel-plugin",

    // This is used for generic search results which do not have a specific plugin as a source
    None = "none",

    // This is only used in unit tests
    Test = "test-plugin",
}
