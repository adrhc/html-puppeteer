import ChildrenShells from "../view/ChildrenShells.js";
import SimplePartsIllustrator from "./SimplePartsIllustrator.js";
import {withDefaults} from "../component/options/ComponentOptionsBuilder.js";
import {isTrue} from "../../util/AssertionUtils.js";
import {partsOf} from "../state/PartialStateHolder.js";

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
     * @type {boolean}
     */
    newChildrenGoLast;

    /**
     * @type {ChildrenComponents}
     */
    get childrenComponents() {
        return this.container.childrenComponents;
    }

    /**
     * @param {SimpleContainerComponent} container
     */
    constructor(container) {
        super(withDefaults({
            componentId: container.id,
        }).to(container.config));
        this.container = container;
        this.newChildrenGoLast = container.config.newChildrenGoLast;
        this.childrenShells = new ChildrenShells({componentId: container.id, ...container.config});
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    created(stateChange) {
        this._createdOrReplaced(stateChange);
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    replaced(stateChange) {
        this._createdOrReplaced(stateChange, true);
    }

    /**
     * @param {StateChange<SCT>} stateChange
     * @param {boolean=} replaced
     * @protected
     */
    _createdOrReplaced(stateChange, replaced) {
        // this must happen before container redraw to give a
        // chance to the children to unbind their event handlers;
        // their view will be automatically destroyed when
        // the parent redraws itself
        this.childrenComponents.disconnectAndRemoveChildren();
        // the parent redraws itself
        super[replaced ? "replaced" : "created"](stateChange);
        // create children for existing (static) shells
        this.childrenComponents.createChildrenForExistingShells();
        // create shell and children for missing (dynamic) shells skipping existing children (having static shells)
        partsOf(stateChange.newState, !this.newChildrenGoLast)
            .filter(([key]) => this.childrenComponents.getChildByPartName(key) == null)
            .forEach(([key]) => this._partCreatedImpl(key));
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {
        this._partCreatedImpl(partStateChange.newPartName);
    }

    /**
     * @param {PartName} newPartName
     * @protected
     */
    _partCreatedImpl(newPartName) {
        const $shell = this.childrenShells.getOrCreateShell(newPartName);
        isTrue($shell != null,
            `$shell is null for part named ${newPartName}!`)
        this.childrenComponents.createOrUpdateChild(newPartName, $shell);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {
        this.childrenComponents.closeAndRemoveChild(partStateChange.previousPartName);
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
