import { Settings } from "@Core/Settings";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

document.addEventListener("DOMContentLoaded", () => {
    createRoot(document.getElementById("react-app") as HTMLDivElement).render(
        <HashRouter>
            <Settings />
        </HashRouter>,
    );
});
