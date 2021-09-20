import StateChangesHandler from "./StateChangesHandler.js";

/**
 * @template SCT, SCP
 *
 * @implements StateChangesHandler
 */
export default class ComponentIllustrator extends StateChangesHandler {
    /**
     * @type {AbstractView}
     */
    view;

    /**
     * @param {StateChange} stateChange
     */
    created(stateChange) {
        this.view.create(stateChange.newStateOrPart);
    }

    /**
     * @param {StateChange} stateChange
     */
    replaced(stateChange) {
        this.view.replace(stateChange.newStateOrPart);
    }

    /**
     * @param {StateChange} stateChange
     */
    removed(stateChange) {
        this.view.remove();
    }

    /**
     * @param {StateChange<SCT, SCP>} stateChange
     */
    changeOccurred(stateChange) {
        // do nothing
    }
}