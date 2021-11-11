import {addDebugger} from "../../html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import StateChangeEventsBinder from "../components/event-binders/StateChangeEventsBinder.js";
import OpenCloseEventsBinder from "../components/event-binders/OpenCloseEventsBinder.js";
import animate from "../../html-puppeteer/core/Puppeteer.js";

/**
 * @param {string=} componentIdToDebug
 */
export function animateOnReadyDocument(componentIdToDebug) {
    $(() => {
        animate(animationOptionsOf(componentIdToDebug));
    });
}

/**
 * @param {string=} componentIdToDebug
 * @return {AnimationOptions}
 */
function animationOptionsOf(componentIdToDebug) {
    const debuggingOptions = debuggingOptionsOf(`${componentIdToDebug}-debugger`);
    return componentIdToDebug ? {[componentIdToDebug]: debuggingOptions} : debuggingOptions;
}

/**
 * @param {ElemIdOrJQuery} elemIdOrJQuery
 * @return {ComponentOptions}
 */
export function debuggingOptionsOf(elemIdOrJQuery) {
    return addDebugger({elemIdOrJQuery})
        .addEventsBinders(new StateChangeEventsBinder(elemIdOrJQuery), new OpenCloseEventsBinder())
        .options();
}
