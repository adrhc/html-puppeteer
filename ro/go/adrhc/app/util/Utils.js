import {addDebugger} from "../../html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import StateChangeEventsBinder from "../components/event-binders/StateChangeEventsBinder.js";
import OpenCloseEventsBinder from "../components/event-binders/OpenCloseEventsBinder.js";
import animate from "../../html-puppeteer/core/Puppeteer.js";

function debuggingOptionsOf(debuggerElemIdOrJQuery = "MAIN-DEBUGGER") {
    return addDebugger({debuggerElemIdOrJQuery})
        .addEventsBinders(new StateChangeEventsBinder(), new OpenCloseEventsBinder())
        .options();
}

/**
 * @param {string=} componentIdToDebug
 * @return {ComponentOptions}
 */
function animationOptionsOf(componentIdToDebug) {
    const debuggingOptions = debuggingOptionsOf();
    return componentIdToDebug ? {[componentIdToDebug]: debuggingOptions} : debuggingOptions;
}

/**
 * @param {string=} componentIdToDebug
 */
export function animateOnReadyDocument(componentIdToDebug) {
    $(() => {
        animate(animationOptionsOf(componentIdToDebug));
    });
}