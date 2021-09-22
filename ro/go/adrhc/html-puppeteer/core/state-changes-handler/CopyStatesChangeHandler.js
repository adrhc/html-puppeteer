import PartialStateChangesHandler from "./PartialStateChangesHandler.js";

export default class CopyStatesChangeHandler extends PartialStateChangesHandler {
    /**
     * @type {AbstractComponent}
     */
    receiverComponent;

    /**
     * @param {AbstractComponent} receiverComponent
     */
    constructor(receiverComponent) {
        super();
        this.receiverComponent = receiverComponent;
    }

    /**
     * @param {StateChange} stateChange
     */
    changeOccurred(stateChange) {
        this.receiverComponent.replaceState(stateChange.newState);
    }
}