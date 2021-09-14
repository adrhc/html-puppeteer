import SimpleComponent from "../core/SimpleComponent.js";
import CopyStateChangeHandler from "../../app/components/state-change-handlers/CopyStateChangeHandler.js";

/**
 * @param {AbstractComponent} component
 * @param {string=} debuggerElemIdOrJQuery
 * @param {string=} initialDebuggerMessage
 * @param {boolean=} showAsJson
 */
export function withDebugger(component, debuggerElemIdOrJQuery = "debugger", initialDebuggerMessage = "state debugger", showAsJson = true) {
    const simpleDebugger = new SimpleComponent({
        elemIdOrJQuery: "debugger",
        initialState: `showing the state${showAsJson ? " as JSON" : ""}`
    }).render();
    component.stateChangesHandlerAdapter.stateChangesHandlers
        .push(new CopyStateChangeHandler(simpleDebugger, showAsJson));
    return component;
}