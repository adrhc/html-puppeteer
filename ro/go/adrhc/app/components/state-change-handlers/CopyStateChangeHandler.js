import StateChangesHandler from "../../../html-puppeteer/core/StateChangesHandler.js";

export default class CopyStateChangeHandler extends StateChangesHandler {
    /**
     * @type {AbstractComponent}
     */
    component;
    /**
     * @type {boolean}
     */
    copyAsJson;

    constructor(component, copyAsJson) {
        super();
        this.component = component;
        this.copyAsJson = copyAsJson;
    }

    changeOccurred(stateChange) {
        const state = stateChange.newStateOrPart;
        const value = !this.copyAsJson ? state :
            (state ? JSON.stringify(state, undefined, 2) : undefined);
        this.component.doWithState(component => component.replace(value));
    }
}