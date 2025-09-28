
/**
 * Restituisce i nomi dei profili Chrome trovati sul sistema.
 * Funziona su Windows e macOS. Su Linux restituisce array vuoto.
 */
export async function getChromeProfiles(): Promise<string[]> {
    // Usa il bridge per accedere al filesystem dal backend (Electron/preload)
    // window.ContextBridge deve esporre una funzione per leggere le directory
    let userDataPath = "";
    const platform = navigator.platform.toLowerCase();

    if (platform.includes("win")) {
        // Windows
        // %LOCALAPPDATA%\Google\Chrome\User Data
        userDataPath = await window.ContextBridge.getPath("home") +
            "/AppData/Local/Google/Chrome/User Data";
    } else if (platform.includes("mac")) {
        // macOS
        // ~/Library/Application Support/Google/Chrome
        userDataPath = await window.ContextBridge.getPath("appData") +
            "/Google/Chrome";
    } else {
        // Linux o altro: non supportato
        return [];
    }

    // Leggi le sottocartelle che corrispondono a profili Chrome
    // (Default, Profile 1, Profile 2, ...)
    try {
        const dirs: string[] = await window.ContextBridge.readDir(userDataPath);
        // Filtra solo le cartelle che sono profili Chrome
        return dirs.filter(
            (name) => name === "Default" || /^Profile \d+$/.test(name)
        );
    } catch (e) {
        // In caso di errore (es. cartella non trovata), restituisci array vuoto
        return [];
    }
}
