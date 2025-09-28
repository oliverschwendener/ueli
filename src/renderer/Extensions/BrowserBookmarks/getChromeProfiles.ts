// Funzione mock: in produzione va implementata via bridge con il backend
export async function getChromeProfiles(): Promise<string[]> {
    // In ambiente reale, questa funzione dovrebbe interrogare il filesystem
    // per trovare le cartelle profilo di Chrome (Default, Profile 1, ...)
    // Qui restituiamo un esempio statico per sviluppo UI
    return ["Default", "Profile 1", "Profile 2"];
}
