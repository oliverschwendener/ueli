import * as os from "os";
import * as path from "path";
import { Executor } from "./executors/executor";
import { IconManager } from "./icon-manager/icon-manager";
import { MacOsIconManager } from "./icon-manager/mac-os-icon-manager";
import { WindowsIconManager } from "./icon-manager/windows-icon-manager";
import { OperatingSystem } from "./operating-system";
import { MacOsProgramRepository } from "./programs-plugin/macos-program-repository";
import { ProgramRepository } from "./programs-plugin/program-repository";
import { WindowsProgramRepository } from "./programs-plugin/windows-program-repository";
import { MacOsSettingsPlugin } from "./search-plugins/mac-os-settings-plugin";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { Windows10SettingsSearchPlugin } from "./search-plugins/windows-10-settings-plugin";

export class Injector {
  public static getWebUrlRegExp(): RegExp {
    return new RegExp(/^((https?:)?[/]{2})?([a-z0-9]+[.])+[a-z]+.*$/i, "gi");
  }

  public static getProgramRepository(platform: string): ProgramRepository {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return new WindowsProgramRepository();
      case OperatingSystem.macOS: return new MacOsProgramRepository();
    }
  }

  public static getIconManager(platform: string): IconManager {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return new WindowsIconManager();
      case OperatingSystem.macOS: return new MacOsIconManager();
    }
  }

  public static getOpenUrlWithDefaultBrowserCommand(platform: string, url: string): string {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return `start "" "${url}"`;
      case OperatingSystem.macOS: return `open "${url}"`;
    }
  }

  public static getFileExecutionCommand(platform: string, filePath: string): string {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return `start "" "${filePath}"`;
      case OperatingSystem.macOS: return `open "${filePath}"`;
    }
  }

  public static getFileLocationExecutionCommand(platform: string, filePath: string): string {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return `start explorer.exe /select,"${filePath}"`;
      case OperatingSystem.macOS: return `open -R "${filePath}"`;
    }
  }

  public static getFilePathRegExp(platform: string): RegExp {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return new RegExp(/^[a-zA-Z]:\\[\\\S|*\S]?.*$/, "gi");
      case OperatingSystem.macOS: return new RegExp(/^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/, "gi");
    }
  }

  public static getDirectorySeparator(platform: string): string {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return "\\";
      case OperatingSystem.macOS: return "/";
    }
  }

  public static getTrayIconPath(platform: string, pathToProjectRoot: string): string {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return path.join(pathToProjectRoot, "img/icons/win/icon.ico");
      case OperatingSystem.macOS: return path.join(pathToProjectRoot, "img/icons/mac/ueliTemplate.png");
    }
  }

  public static getOperatingSystemSettingsPlugin(platform: string): SearchPlugin {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return new Windows10SettingsSearchPlugin();
      case OperatingSystem.macOS: return new MacOsSettingsPlugin();
    }
  }

  public static getStyleSheetPath(platform: string): string {
    switch (Injector.getOperatingSystem(platform)) {
      case OperatingSystem.Windows: return "./build/css/windows.css";
      case OperatingSystem.macOS: return "./build/css/mac.css";
    }
  }

  private static getOperatingSystem(platform: string): OperatingSystem {
    switch (platform) {
      case "win32": return OperatingSystem.Windows;
      case "darwin": return OperatingSystem.macOS;
    }

    throw new Error("This operating system is not supported");
  }
}
