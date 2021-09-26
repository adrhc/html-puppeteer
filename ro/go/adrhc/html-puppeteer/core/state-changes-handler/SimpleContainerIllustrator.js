import GuestsRoomView from "../view/GuestsRoomView.js";
import SimplePartsIllustrator from "./SimplePartsIllustrator.js";

/**
 * @typedef {ComponentIllustratorOptions & GuestsRoomViewOptions} SimpleContainerIllustratorOptions
 * @property {string=} componentId
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimpleContainerIllustrator extends SimplePartsIllustrator {
    /**
     * @type {GuestsRoomView}
     */
    guestsRoomView;

    /**
     * @param {SimpleContainerIllustratorOptions} options
     * @param {ViewValuesTransformerFn} options.viewValuesTransformerFn
     * @param {SimpleContainerIllustratorOptions} options.restOfOptions
     */
    constructor({viewValuesTransformerFn, ...restOfOptions}) {
        super(restOfOptions);
        this.guestsRoomView = new GuestsRoomView(restOfOptions);
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
        this.guestsRoomView.create(partStateChange.newPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRelocated(partStateChange) {
        this.guestsRoomView.remove(partStateChange.previousPartName);
        this.guestsRoomView.create(partStateChange.newPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partChangeOccurred(partStateChange) {
        // do nothing
    }
}
