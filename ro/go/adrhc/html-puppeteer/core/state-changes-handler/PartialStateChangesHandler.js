import StateChangesHandler from "../StateChangesHandler.js";

export default class PartialStateChangesHandler extends StateChangesHandler {
    /**
     * @param {StateChange} stateChange
     */
    partRemoved(stateChange) {}

    /**
     * @param {StateChange} stateChange
     */
    partCreated(stateChange) {}

    /**
     * @param {StateChange} stateChange
     */
    partRelocated(stateChange) {}

    /**
     * @param {StateChange} stateChange
     */
    partReplaced(stateChange) {}

    /**
     * @param {StateChange} stateChange
     */
    partChangeOccurred(stateChange) {}
}