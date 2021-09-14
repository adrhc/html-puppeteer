import StateChangesHandler from "./StateChangesHandler";

export default class PartialStateChangesHandler extends StateChangesHandler {
    partRemoved(stateChange) {}

    partCreated(stateChange) {}

    partRelocated(stateChange) {}

    partReplaced(stateChange) {}
}