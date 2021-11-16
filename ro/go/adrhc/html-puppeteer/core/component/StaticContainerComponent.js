import {isTrue} from "../../util/AssertionUtils.js";
import ChildrenShellFinder from "../view/ChildrenShellFinder.js";
import {stateIsEmpty} from "../state/StateHolder.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";

/**
 * @typedef {AbstractContainerComponentOptions} StaticContainerComponentOptions
 * @property {ChildrenShellFinder=} childrenShellFinder
 * @property {boolean=} ignoreMissingShells
 */
/**
 * @template SCT, SCP
 */
export default class StaticContainerComponent extends AbstractContainerComponent {
    /**
     * @type {ChildrenShellFinder}
     */
    childrenShellFinder;
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
        this.childrenShellFinder = this.config.childrenShellFinder ?? new ChildrenShellFinder(this.config.elemIdOrJQuery);
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
        this.childrenCollection.createChildrenForExistingShells();
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
            this.childrenCollection.getChildByPartName(partName).forEach(it => it.close());
            super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
        } else {
            super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
            this._createOrUpdateChild(partName);
        }
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _createOrUpdateChild(partName) {
        const $shell = this.childrenShellFinder.$childShellByName(partName);
        if (!$shell) {
            isTrue(this.ignoreMissingShells, `$shell is null for part named ${partName}!`);
            return;
        }
        this.childrenCollection.createOrUpdateChild($shell);
    }
}