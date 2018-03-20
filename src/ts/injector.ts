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
  public static getCurrentOperatingSystem(): OperatingSystem {
    switch (os.platform()) {
      case "win32": return OperatingSystem.Windows;
      case "darwin": return OperatingSystem.macOS;
      default: throw new Error("This operating system is not supported");
    }
  }

  public static getWebUrlRegExp(): RegExp {
    return new RegExp(/^((https?:)?[/]{2})?([a-z0-9]+[.])+[a-z]+.*$/i, "gi");
  }

  public static getProgramRepository(): ProgramRepository {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return new WindowsProgramRepository();
      case OperatingSystem.macOS: return new MacOsProgramRepository();
    }
  }

  public static getIconManager(): IconManager {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return new WindowsIconManager();
      case OperatingSystem.macOS: return new MacOsIconManager();
    }
  }

  public static getOpenUrlWithDefaultBrowserCommand(url: string): string {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return `start "" "${url}"`;
      case OperatingSystem.macOS: return `open "${url}"`;
    }
  }

  public static getFileExecutionCommand(filePath: string): string {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return `start "" "${filePath}"`;
      case OperatingSystem.macOS: return `open "${filePath}"`;
    }
  }

  public static getFileLocationExecutionCommand(filePath: string): string {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return `start explorer.exe /select,"${filePath}"`;
      case OperatingSystem.macOS: return `open -R "${filePath}"`;
    }
  }

  public static getFilePathRegExp(): RegExp {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return new RegExp(/^[a-zA-Z]:\\[\\\S|*\S]?.*$/, "gi");
      case OperatingSystem.macOS: return new RegExp(/^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/, "gi");
    }
  }

  public static getDirectorySeparator(): string {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return "\\";
      case OperatingSystem.macOS: return "/";
    }
  }

  public static getTrayIconPath(pathToProjectRoot: string): string {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return path.join(pathToProjectRoot, "img/icons/win/icon.ico");
      case OperatingSystem.macOS: return path.join(pathToProjectRoot, "img/icons/png/ueliTemplate.png");
    }
  }

  public static getOperatingSystemSettingsPlugin(): SearchPlugin {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return new Windows10SettingsSearchPlugin();
      case OperatingSystem.macOS: return new MacOsSettingsPlugin();
    }
  }

  public static getStyleSheetPath(): string {
    switch (Injector.getCurrentOperatingSystem()) {
      case OperatingSystem.Windows: return "./build/css/windows.css";
      case OperatingSystem.macOS: return "./build/css/mac.css";
    }
  }
}
