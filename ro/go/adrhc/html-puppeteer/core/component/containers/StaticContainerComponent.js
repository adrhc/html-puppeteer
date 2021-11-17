import {stateIsEmpty} from "../../state/StateHolder.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";
import {isTrue} from "../../../util/AssertionUtils.js";

/**
 * @typedef {AbstractContainerComponentOptions} StaticContainerComponentOptions
 * @property {boolean=} ignoreMissingShells
 */
/**
 * @template SCT, SCP
 */
export default class StaticContainerComponent extends AbstractContainerComponent {
    /**
     * @type {boolean}
     */
    ignoreMissingShells;

    /**
     * No children will be dynamically created hence there's no need for a shell template.
     *
     * @param {StaticContainerComponentOptions} options
     */
    constructor(options) {
        super({ignoreShellTemplateOptions: true, ...options});
        this.ignoreMissingShells = this.config.ignoreMissingShells ?? true;
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
        this.childrenCollection.disconnectAndRemoveChildren();
        // the parent redraws itself
        super.replaceState(newState);
        // create children for existing (static) shells
        this.childrenCollection.createChildrenForAllShells();
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
            this.childrenCollection.getChildrenByPartName(partName).forEach(it => it.close());
            super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
        } else {
            super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
            this._updateChildrenByPartName(partName, this.ignoreMissingShells);
        }
    }

    /**
     * @param {PartName} partName
     * @param {boolean=} ignoreMissingShells
     * @protected
     */
    _updateChildrenByPartName(partName, ignoreMissingShells) {
        const childrenByPartName = this.childrenCollection.getChildrenByPartName(partName);
        if (!childrenByPartName.length) {
            isTrue(ignoreMissingShells, `[_updateChildrenByPartName] childrenByPartName is empty for part named ${partName}!`);
            return;
        }
        childrenByPartName.forEach(it => it.replaceFromParent());
    }

    /**
     * set state to undefined
     */
    close() {
        this.childrenCollection.closeChildren();
        super.close();
    }
}