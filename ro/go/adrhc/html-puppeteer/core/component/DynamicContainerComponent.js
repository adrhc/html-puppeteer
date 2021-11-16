import {jQueryOf} from "../../util/Utils.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import ContainerEventsBinder from "./events-binder/ContainerEventsBinder.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";
import {stateIsEmpty} from "../state/StateHolder.js";
import {partsOf} from "../state/PartialStateHolder.js";
import {isTrue} from "../../util/AssertionUtils.js";
import ContainerHelper from "../../helper/ContainerHelper.js";

/**
 * @typedef {AbstractContainerComponentOptions & ContainerEventsBinderOptions} DynamicContainerComponentOptions
 */
/**
 * @template SCT, SCP
 */
export default class DynamicContainerComponent extends AbstractContainerComponent {
    /**
     * ChildrenShells have the chance to use containerHtml for children shells.
     * We have to set htmlTemplate to something not null (by default "") to
     * avoid the drawing of the parent's html which by now is a candidate
     * for the children shell template.
     *
     * @param {DynamicContainerComponentOptions} options
     */
    constructor(options) {
        super(withDefaults({
            containerHtml: jQueryOf(options.elemIdOrJQuery).html(),
            htmlTemplate: "", ...options
        }).addEventsBinders(new ContainerEventsBinder()).options());
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
        this.uniquePartsChildren.disconnectAndRemoveChildren();
        // the parent redraws itself
        super.replaceState(newState);
        // create children for existing (static) shells
        this.uniquePartsChildren.createChildrenForExistingShells();
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
     * set state to undefined
     */
    close() {
        this.uniquePartsChildren.closeAndRemoveChildren();
        super.close();
    }

    /**
     * Creates the children and shells for parts not already having the related child created.
     *
     * @protected
     */
    _createMissingShellsAndChildren() {
        partsOf(this.getMutableState())
            .filter(([key]) => !this.partialStateHolder.hasEmptyPart(key))
            .filter(([key]) => this.uniquePartsChildren.getChildByPartName(key) == null)
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
        this.uniquePartsChildren.createOrUpdateChild($shell);
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _removeChild(partName) {
        this.uniquePartsChildren.closeAndRemoveChild(partName);
        // the shell might actually be removed already by the closing child
        this.childrenShells.removeShell(partName);
    }
}