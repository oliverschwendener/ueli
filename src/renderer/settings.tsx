import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

document.addEventListener("DOMContentLoaded", () => {
    createRoot(document.getElementById("react-app") as HTMLDivElement).render(
        <HashRouter>
            <h1> Hello from settings </h1>
        </HashRouter>,
    );
});
