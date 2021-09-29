import ChildrenShellsView from "../view/ChildrenShellsView.js";
import SimplePartsIllustrator from "./SimplePartsIllustrator.js";

/**
 * @typedef {ComponentIllustratorOptions & GuestsRoomViewOptions} ComplexContainerIllustratorOptions
 * @property {string=} componentId
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class ComplexContainerIllustrator extends SimplePartsIllustrator {
    /**
     * @type {ChildrenShellsView}
     */
    guestsRoomView;

    /**
     * @param {ComplexContainerIllustratorOptions} options
     * @param {ViewValuesTransformerFn} options.viewValuesTransformerFn
     * @param {ComplexContainerIllustratorOptions} options.restOfOptions
     */
    constructor({viewValuesTransformerFn, ...restOfOptions}) {
        super(restOfOptions);
        this.guestsRoomView = new ChildrenShellsView(restOfOptions);
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    created(stateChange) {
        super.created(stateChange);
        this.guestsRoomView.parentUpdated()
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    replaced(stateChange) {
        super.replaced(stateChange);
        this.guestsRoomView.parentUpdated()
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {
        this.guestsRoomView.remove(partStateChange.previousPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {
        return this.guestsRoomView.create(partStateChange.newPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRelocated(partStateChange) {
        this.guestsRoomView.remove(partStateChange.previousPartName);
        return this.guestsRoomView.create(partStateChange.newPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partReplaced(partStateChange) {
        // do nothing
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partChangeOccurred(partStateChange) {
        // do nothing
    }
}
