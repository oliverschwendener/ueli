import { SearchResultItem } from "../../../common/search-result-item";
import { exec } from "child_process";

const executeCommand = (command: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        exec(command, (err): void => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export function executeMacApp(searchResultItem: SearchResultItem): Promise<void> {
    return new Promise((resolve, reject) => {
        const command = `open "${searchResultItem.executionArgument}"`;
        executeCommand(command)
            .then(() => resolve())
            .catch((err) => reject(err));
    });
}

export function executeWindowsApp(searchResultItem: SearchResultItem): Promise<void> {
    return new Promise((resolve, reject) => {
        const command = `start "" "${searchResultItem.executionArgument}"`;
        executeCommand(command)
            .then(() => resolve())
            .catch((err) => reject(err));
    });
}
