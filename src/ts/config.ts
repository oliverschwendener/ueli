import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { CommandLineExecutionArgumentValidator } from "./execution-argument-validators/command-line-execution-argument-validator";
import { UeliCommandExecutionArgumentValidator } from "./execution-argument-validators/ueli-command-execution-argument-validator";
import { FilePathExecutionArgumentValidator } from "./execution-argument-validators/file-path-execution-argument-validator";
import { WebSearchExecutionArgumentValidator } from "./execution-argument-validators/web-search-execution-argument-validator";
import { WebUrlExecutionArgumentValidator } from "./execution-argument-validators/web-url-execution-argument-validator";
import { CommandLineExecutor } from "./executors/command-line-executor";
import { UeliCommandExecutor } from "./executors/ueli-command-executor";
import { FilePathExecutor } from "./executors/file-path-executor";
import { WebSearchExecutor } from "./executors/web-search-executor";
import { WebUrlExecutor } from "./executors/web-url-executor";
import { InputValidationService } from "./input-validation-service";
import { WebSearch } from "./web-search";
import { ConfigLoader } from "./config-loader";
import { OperatingSystemHelpers } from "./helpers/operating-system-helpers";
import { OperatingSystem } from "./operating-system";
import { ConfigOptions } from "./config-options";
import { defaultConfig } from "./default-config";

const configFilePath = path.join(os.homedir(), "ueli.config.json");
const configLoader = new ConfigLoader(defaultConfig, configFilePath);
const config = configLoader.loadConfigFromConfigFile();

export class Config {
    public static readonly applicationFolders = config.applicationFolders;
    public static readonly userInputHeight = config.userInputHeight;
    public static readonly userInputFontSize = config.userInputFontSize;
    public static readonly searchResultExecutionArgumentFontSize = config.searchResultExecutionArgumentFontSize;
    public static readonly searchResultNameFontSize = config.searchResultNameFontSize;
    public static readonly searchResultHeight = config.searchResultHeight;
    public static readonly configFilePath = configFilePath;
    public static readonly windowWith = config.windowWith;
    public static readonly maxSearchResultCount = config.maxSearchResultCount;
    public static readonly rescanInterval = config.rescanInterval;
    public static readonly autoStartApp = config.autoStartApp;
    public static readonly showHiddenFiles = config.showHiddenFiles;
    public static readonly searchOperatingSystemSettings = config.searchOperatingSystemSettings;
    public static readonly webSearches = config.webSearches;
}
