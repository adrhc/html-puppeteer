import {partsOf} from "../state/PartialStateHolder.js";
import {isTrue} from "../../util/AssertionUtils.js";
import {stateIsEmpty} from "../state/StateHolder.js";
import ContainerHelper from "../../helper/ContainerHelper.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";

/**
 * @typedef {AbstractContainerComponentOptions} BasicContainerComponentOptions
 */
/**
 * @template SCT, SCP
 */
export default class BasicContainerComponent extends AbstractContainerComponent {
    /**
     * @type {ChildrenShells}
     */
    childrenShells;

    /**
     * @return {boolean}
     */
    get newChildrenGoLast() {
        return this.config.newChildrenGoLast;
    }

    /**
     * @param {BasicContainerComponentOptions} options
     */
    constructor(options) {
        super(options);
        const helper = new ContainerHelper(this);
        this.childrenShells = helper.createChildrenShells();
    }

    /**
     * Completely replaces the component's state and creates the children.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        // this must happen before container redraw to give a
        // chance to the children to unbind their event handlers;
        // their view will be automatically destroyed when
        // the parent redraws itself
        this.childrenComponents.disconnectAndRemoveChildren();
        // the parent redraws itself
        super.replaceState(newState);
        // create children for existing (static) shells
        this.childrenComponents.createChildrenForExistingShells();
        // create dynamic children
        this._createMissingShellsAndChildren();
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     * @param {boolean=} dontRecordChanges
     */
    replacePart(previousPartName, newPart, newPartName, dontRecordChanges) {
        const partName = newPartName ?? previousPartName;
        if (stateIsEmpty(newPart)) {
            this._removeChild(partName);
            super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
        } else {
            super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
            this._createOrUpdateChild(partName);
        }
    }

    /**
     * @param {string} childId
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePartByChildId(childId, newPart, newPartName) {
        const partName = this.childrenComponents.getChildById(childId).partName;
        this.replacePart(partName, newPart, newPartName);
    }

    /**
     * set state to undefined
     */
    close() {
        this.childrenComponents.closeAndRemoveChildren();
        super.close();
    }

    /**
     * Creates the children and shells for parts not already having the related child created.
     *
     * @protected
     */
    _createMissingShellsAndChildren() {
        const state = this.getMutableState();
        partsOf(state, !this.newChildrenGoLast)
            .filter(([key]) => !this.partialStateHolder.hasEmptyPart(key))
            .filter(([key]) => this.childrenComponents.getChildByPartName(key) == null)
            .forEach(([key]) => this._createOrUpdateChild(key));
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _createOrUpdateChild(partName) {
        const $shell = this.childrenShells.getOrCreateShell(partName);
        isTrue($shell != null,
            `$shell is null for part named ${partName}!`)
        this.childrenComponents.createOrUpdateChild($shell);
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _removeChild(partName) {
        this.childrenComponents.closeAndRemoveChild(partName);
        // the shell might actually be removed already by the closing child
        this.childrenShells.removeShell(partName);
    }
}