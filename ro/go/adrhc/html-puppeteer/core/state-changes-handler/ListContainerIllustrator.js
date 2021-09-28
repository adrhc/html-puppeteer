import GuestsRoomView from "../view/GuestsRoomView.js";
import SimplePartsIllustrator from "./SimplePartsIllustrator.js";
import {withDefaults} from "../component/options/ComponentOptionsBuilder.js";

/**
 * @typedef {ComponentIllustratorOptions & GuestsRoomViewOptions} ListContainerIllustratorOptions
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class ListContainerIllustrator extends SimplePartsIllustrator {
    /**
     * @type {GuestsRoomView}
     */
    guestsRoomView;

    /**
     * @param {ListContainerIllustratorOptions} options
     * @param {ViewValuesTransformerFn} options.viewValuesTransformerFn
     * @param {ListContainerIllustratorOptions} options.restOfOptions
     */
    constructor({viewValuesTransformerFn, ...restOfOptions}) {
        super(withDefaults({
            htmlTemplate: restOfOptions.htmlTemplate ?? (restOfOptions.templateId ? undefined : "")
        }).to(restOfOptions));
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
