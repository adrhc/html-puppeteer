import {addDebugger} from "../../html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import StateChangeEventsBinder from "../components/event-binders/StateChangeEventsBinder.js";
import OpenCloseEventsBinder from "../components/event-binders/OpenCloseEventsBinder.js";
import animate from "../../html-puppeteer/core/Puppeteer.js";

export const DEBUGGING_OPTIONS = addDebugger({debuggerElemIdOrJQuery: "main-debugger"})
    .addEventsBinders(new StateChangeEventsBinder(), new OpenCloseEventsBinder())
    .options();

export function animateOnReadyDocument() {
    $(() => {
        animate(DEBUGGING_OPTIONS);
    });
}