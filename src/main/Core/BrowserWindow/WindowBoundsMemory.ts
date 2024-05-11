import type { BrowserWindow, Rectangle, Screen } from "electron";

export class WindowBoundsMemory {
    public constructor(
        private readonly screen: Screen,
        private memory: Record<string, Rectangle>,
    ) {}

    public getBoundsNearestToCursor(): Rectangle | undefined {
        const displayId = this.getDisplayIdNearestToCursor();
        return this.memory[this.getInternalDisplayId(displayId)];
    }

    public saveWindowBounds(browserWindow: BrowserWindow): void {
        const displayId = this.getDisplayIdNearestToBrowserWindow(browserWindow);
        this.memory[this.getInternalDisplayId(displayId)] = browserWindow.getBounds();
    }

    private getDisplayIdNearestToCursor(): number {
        return this.screen.getDisplayNearestPoint(this.screen.getCursorScreenPoint()).id;
    }

    private getDisplayIdNearestToBrowserWindow(browserWindow: BrowserWindow): number {
        return this.screen.getDisplayNearestPoint(browserWindow.getBounds()).id;
    }

    private getInternalDisplayId(displayId: number): string {
        return `display[${displayId}]`;
    }
}
