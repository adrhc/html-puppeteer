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
     * @type {ListContainerComponent}
     */
    container;
    /**
     * @type {GuestsRoomView}
     */
    guestsRoomView;

    /**
     * @type {ChildrenGroup}
     */
    get childrenGroup() {
        return this.container.childrenGroup;
    }

    /**
     * @param {ListContainerComponent} component
     */
    constructor(component) {
        super(withDefaults({
            htmlTemplate: component.config.htmlTemplate ?? (component.config.templateId ? undefined : "")
        }).to(_.cloneDeep(component.config)));
        this.container = component;
        this.guestsRoomView = new GuestsRoomView({componentId: component.id, ...component.config});
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
        this.guestsRoomView.parentUpdated();
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {
        this.guestsRoomView.create(partStateChange.newPartName);
        this.childrenGroup.createItem(partStateChange.newPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {
        this.childrenGroup.removeItem(partStateChange.previousPartName);
        this.guestsRoomView.remove(partStateChange.previousPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partReplaced(partStateChange) {
        this.childrenGroup.replaceItemState(partStateChange.previousPartName, partStateChange.newPart);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRelocated(partStateChange) {
        this.partRemoved(partStateChange);
        this.partCreated(partStateChange);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partChangeOccurred(partStateChange) {
        // do nothing
    }
}
