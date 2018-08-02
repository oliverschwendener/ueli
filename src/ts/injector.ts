import { IconSet } from "./icon-sets/icon-set";
import { MacOsIconSet } from "./icon-sets/mac-os-icon-set";
import { WindowsIconSet } from "./icon-sets/windows-icon-set";
import { OperatingSystem } from "./operating-system";
import { MacOsSettingsPlugin } from "./search-plugins/mac-os-settings-plugin";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { Windows10SettingsSearchPlugin } from "./search-plugins/windows-10-settings-plugin";
import { DirectorySeparator } from "./directory-separator";
import { FileExecutionCommandBuilder } from "./builders/file-execution-command-builder";
import { FileLocationExecutionCommandBuilder } from "./builders/file-location-execution-command-builder";
import { FilePathRegex } from "./file-path-regex";
import { OpenUrlWithDefaultBrowserCommandBuilder } from "./builders/open-url-with-default-browser-command-builder";
import { StylesheetPath } from "./builders/stylesheet-path-builder";
import { TrayIconPathBuilder } from "./builders/tray-icon-path-builder";
import { OperatingSystemHelpers } from "./helpers/operating-system-helpers";

export class Injector {
  public static getWebUrlRegExp(): RegExp {
    return new RegExp(/^((https?:)?[/]{2})?([a-z0-9]+[.])+[a-z]+.*$/i, "gi");
  }

  public static getIconSet(platform: string): IconSet {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows: return new WindowsIconSet();
      case OperatingSystem.macOS: return new MacOsIconSet();
    }
  }

  public static getOpenUrlWithDefaultBrowserCommand(platform: string, url: string): string {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows:
        return OpenUrlWithDefaultBrowserCommandBuilder.buildWindowsCommand(url);
      case OperatingSystem.macOS:
        return OpenUrlWithDefaultBrowserCommandBuilder.buildMacCommand(url);
    }
  }

  public static getFileExecutionCommand(platform: string, filePath: string): string {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows:
        return FileExecutionCommandBuilder.buildWindowsFileExecutionCommand(filePath);
      case OperatingSystem.macOS:
        return FileExecutionCommandBuilder.buildMacOsFileExecutionCommand(filePath);
    }
  }

  public static getFileLocationExecutionCommand(platform: string, filePath: string): string {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows:
        return FileLocationExecutionCommandBuilder.buildWindowsLocationExecutionCommand(filePath);
      case OperatingSystem.macOS:
        return FileLocationExecutionCommandBuilder.buildMacOsLocationExecutionCommand(filePath);
    }
  }

  public static getFilePathRegExp(platform: string): RegExp {
    const globalAndIgnoreCaseRegexOption = "gi";

    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows: return new RegExp(FilePathRegex.windowsFilePathRegExp, globalAndIgnoreCaseRegexOption);
      case OperatingSystem.macOS: return new RegExp(FilePathRegex.macOsFilePathRegexp, globalAndIgnoreCaseRegexOption);
    }
  }

  public static getDirectorySeparator(platform: string): DirectorySeparator {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows: return DirectorySeparator.WindowsDirectorySeparator;
      case OperatingSystem.macOS: return DirectorySeparator.macOsDirectorySeparator;
    }
  }

  public static getTrayIconPath(platform: string, pathToProjectRoot: string): string {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows:
        return TrayIconPathBuilder.buildWindowsTrayIconPath(pathToProjectRoot);
      case OperatingSystem.macOS:
        return TrayIconPathBuilder.buildMacOsTrayIconPath(pathToProjectRoot);
    }
  }

  public static getOperatingSystemSettingsPlugin(platform: string): SearchPlugin {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows: return new Windows10SettingsSearchPlugin();
      case OperatingSystem.macOS: return new MacOsSettingsPlugin();
    }
  }

  public static getStyleSheetPath(platform: string): string {
    switch (OperatingSystemHelpers.getOperatingSystemFromString(platform)) {
      case OperatingSystem.Windows: return StylesheetPath.Windows;
      case OperatingSystem.macOS: return StylesheetPath.MacOs;
    }
  }
}
