import ComponentIllustrator from "./ComponentIllustrator.js";
import ChildrenRoomView from "../view/ChildrenRoomView.js";

/**
 * @typedef {ChildrenRoomViewOptions & AbstractTemplateViewOptions & ComponentIllustratorOptions} SimpleContainerIllustratorOptions
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimpleContainerIllustrator extends ComponentIllustrator {
    /**
     * @type {ChildrenRoomView}
     */
    childrenRoomView;

    /**
     * @param {SimpleContainerIllustratorOptions} options
     */
    constructor(options) {
        super(options);
        this.childrenRoomView = new ChildrenRoomView(options);
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    created(stateChange) {
        super.created(stateChange);
        this.childrenRoomView.parentUpdated()
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    replaced(stateChange) {
        super.replaced(stateChange);
        this.childrenRoomView.parentUpdated()
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {
        this.childrenRoomView.remove(partStateChange.previousPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {
        this.childrenRoomView.create(partStateChange.newPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRelocated(partStateChange) {
        this.childrenRoomView.remove(partStateChange.previousPartName);
        this.childrenRoomView.create(partStateChange.newPartName);
    }
}
