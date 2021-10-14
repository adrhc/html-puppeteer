import ChildrenShells from "../view/ChildrenShells.js";
import SimplePartsIllustrator from "./SimplePartsIllustrator.js";
import {withDefaults} from "../component/options/ComponentOptionsBuilder.js";
import {isTrue} from "../../util/AssertionUtils.js";

/**
 * @typedef {ComponentIllustratorOptions & ChildrenShellsOptions} SimpleContainerIllustratorOptions
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimpleContainerIllustrator extends SimplePartsIllustrator {
    /**
     * @type {ChildrenShells}
     */
    childrenShells;
    /**
     * @type {SimpleContainerComponent}
     */
    container;

    /**
     * @type {ChildrenComponents}
     */
    get childrenComponents() {
        return this.container.childrenComponents;
    }

    /**
     * @param {SimpleContainerComponent} component
     */
    constructor(component) {
        super(withDefaults({
            componentId: component.id,
        }).to(component.config));
        this.container = component;
        this.childrenShells = new ChildrenShells({componentId: component.id, ...component.config});
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    created(stateChange) {
        // this must happen before container redraw to give a
        // chance to the children to unbind their event handlers;
        // their view will be automatically destroyed when
        // the parent redraws itself
        this.childrenComponents.disconnectAndRemoveAll();
        // the parent redraws itself
        super.created(stateChange);
        this.childrenComponents.summonChildren();
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    replaced(stateChange) {
        super.replaced(stateChange);
        this.childrenComponents.summonChildren();
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {
        const $shell = this.childrenShells.getOrCreateShell(partStateChange.newPartName);
        isTrue($shell != null,
            `$shell is null!\n\n${JSON.stringify(partStateChange)}`)
        this.childrenComponents.createOrUpdateChild(partStateChange.newPartName, $shell);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {
        this.childrenComponents.removeItem(partStateChange.previousPartName);
        // the shell might actually be removed already by the closing child
        this.childrenShells.removeShell(partStateChange.previousPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partReplaced(partStateChange) {
        // parent state changed (a part of it) hence we force the child to update
        // its state using its logic of getting its state from parent state's part
        this.childrenComponents.updateFromParent(partStateChange.previousPartName);
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
