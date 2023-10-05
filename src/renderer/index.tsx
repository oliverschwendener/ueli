import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";

document.addEventListener("DOMContentLoaded", () => {
    createRoot(document.getElementById("react-app") as HTMLDivElement).render(
        <HashRouter>
            <App />
        </HashRouter>,
    );
});
