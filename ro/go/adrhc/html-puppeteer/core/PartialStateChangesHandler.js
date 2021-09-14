import StateChangesHandler from "./StateChangesHandler.js";

export default class PartialStateChangesHandler extends StateChangesHandler {
    partRemoved(stateChange) {}

    partCreated(stateChange) {}

    partRelocated(stateChange) {}

    partReplaced(stateChange) {}
}