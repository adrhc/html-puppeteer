import {jQueryOf} from "../../../util/Utils.js";
import {withDefaults} from "../options/ComponentOptionsBuilder.js";
import ContainerEventsBinder from "../events-binder/ContainerEventsBinder.js";
import {isStateEmpty} from "../../state/StateHolder.js";
import {partsOf} from "../../state/PartialStateHolder.js";
import {isTrue} from "../../../util/AssertionUtils.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";

/**
 * @typedef {AbstractContainerComponentOptions} DynamicContainerComponentOptions
 */
/**
 * @template SCT, SCP
 */
export default class DynamicContainerComponent extends AbstractContainerComponent {
    /**
     * @type {ShellsManager}
     */
    shellsManager;

    /**
     * ShellsManager have the chance to use containerHtml for children shells.
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
        this.shellsManager = this.containerHelper.createShellsManager();
    }

    /**
     * Completely replaces the component's state and creates the children.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        // this must happen before container redraw to give a
        // chance to the children to unbind their event handlers
        this.childrenCollection.closeAndRemoveAll();
        // the parent redraws itself
        super.replaceState(newState);
        // create children for existing (static) shells
        this.createChildrenForAllShells();
        // create dynamic children
        this._createMissingChildren();
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     * @param {boolean=} dontRecordChanges
     */
    replacePart(previousPartName, newPart, newPartName, dontRecordChanges) {
        const partName = newPartName ?? previousPartName;
        if (isStateEmpty(newPart)) {
            this.childrenCollection.closeAndRemoveByPartName(partName);
            super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
        } else {
            super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
            this._createOrUpdateChildrenByPartName(partName);
        }
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _createOrUpdateChildrenByPartName(partName) {
        const childrenByPartName = this.childrenCollection.getChildrenByPartName(partName);
        if (childrenByPartName.length) {
            childrenByPartName.forEach(it => it.replaceFromParent());
        } else {
            this._createChildrenByPartName(partName)
        }
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _createChildrenByPartName(partName) {
        const $shells = this.shellsManager.createAndPlaceShell(partName);
        isTrue(!!$shells.length, `$shells is empty for part named ${partName}!`)
        $shells.forEach($el => this.childrenCollection.createComponentForShell($el))
    }

    /**
     * Creates the children and shells for parts not already having the related child created.
     *
     * @protected
     */
    _createMissingChildren() {
        partsOf(this.getMutableState())
            .filter(([key]) => !this.partialStateHolder.hasEmptyPart(key))
            .filter(([key]) => !this.childrenCollection.getChildrenByPartName(key).length)
            .forEach(([key]) => this._createChildrenByPartName(key));
    }
}
