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

    created(stateChange) {
        this._copyState(stateChange.newStateOrPart);
    }

    replaced(stateChange) {
        this._copyState(stateChange.newStateOrPart);
    }

    removed(stateChange) {
        this._copyState(stateChange.newStateOrPart);
    }

    _copyState(newState) {
        const value = this.copyAsJson ? (newState ? JSON.stringify(newState, undefined, 2) : undefined) : newState;
        this.component.doWithState(component => component.replace(value));
    }
}