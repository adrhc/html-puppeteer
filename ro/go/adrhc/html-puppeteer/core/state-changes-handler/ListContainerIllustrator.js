import ChildrenShellsView from "../view/ChildrenShellsView.js";
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
     * @type {ChildrenShellsView}
     */
    childrenShellsView;
    /**
     * @type {ListContainerComponent}
     */
    container;

    /**
     * @type {ChildrenComponents}
     */
    get childrenComponents() {
        return this.container.childrenComponents;
    }

    /**
     * @param {ListContainerComponent} component
     */
    constructor(component) {
        super(withDefaults({
            htmlTemplate: component.config.htmlTemplate ?? (component.config.templateId ? undefined : "")
        }).to(_.cloneDeep(component.config)));
        this.container = component;
        this.childrenShellsView = new ChildrenShellsView({componentId: component.id, ...component.config});
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    created(stateChange) {
        super.created(stateChange);
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    replaced(stateChange) {
        super.replaced(stateChange);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {
        this.childrenShellsView.create(partStateChange.newPartName);
        this.childrenComponents.createItem(partStateChange.newPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {
        this.childrenComponents.removeItem(partStateChange.previousPartName);
        this.childrenShellsView.remove(partStateChange.previousPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partReplaced(partStateChange) {
        // parent state changed (a part of it) hence we force the child to
        // update its state using its logic of getting its part from state
        this.childrenComponents.parentStateChangedFor(partStateChange.previousPartName);
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
