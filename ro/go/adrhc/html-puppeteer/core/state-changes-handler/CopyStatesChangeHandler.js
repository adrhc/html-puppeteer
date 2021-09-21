import PartialStateChangesHandler from "./PartialStateChangesHandler.js";
import StateChange from "../state/change/StateChange.js";

export default class CopyStatesChangeHandler extends PartialStateChangesHandler {
    /**
     * @type {boolean}
     */
    copyAsJson;
    /**
     * @type {AbstractComponent}
     */
    receiverComponent;

    /**
     * @param {AbstractComponent} receiverComponent
     * @param {boolean} copyAsJson
     */
    constructor(receiverComponent, copyAsJson) {
        super();
        this.receiverComponent = receiverComponent;
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
        this.receiverComponent.replaceState(value);
    }
}