import PartialStateChangesHandler from "./PartialStateChangesHandler.js";
import StateChange from "../state/change/StateChange.js";

export default class CopyStatesChangeHandler extends PartialStateChangesHandler {
    /**
     * @type {AbstractComponent}
     */
    component;
    /**
     * @type {boolean}
     */
    copyAsJson;

    /**
     * @param {AbstractComponent} component
     * @param {boolean} copyAsJson
     */
    constructor(component, copyAsJson) {
        super();
        this.component = component;
        this.copyAsJson = copyAsJson;
    }

    /**
     * @param {PartStateChange} partStateChange
     */
    partChangeOccurred(partStateChange) {
        this.changeOccurred(new StateChange(partStateChange.previousState, partStateChange.newState))
    }

    /**
     * @param {StateChange} stateChange
     */
    changeOccurred(stateChange) {
        const state = stateChange.newState;
        const value = !this.copyAsJson ? state :
            (state ? JSON.stringify(state, undefined, 2) : undefined);
        this.component.doWithState(component => component.replace(value));
    }
}