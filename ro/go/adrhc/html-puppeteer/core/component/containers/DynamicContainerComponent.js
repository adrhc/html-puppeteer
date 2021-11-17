import {jQueryOf} from "../../../util/Utils.js";
import {withDefaults} from "../options/ComponentOptionsBuilder.js";
import ContainerEventsBinder from "../events-binder/ContainerEventsBinder.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";
import {stateIsEmpty} from "../../state/StateHolder.js";
import {partsOf} from "../../state/PartialStateHolder.js";
import {isTrue} from "../../../util/AssertionUtils.js";
import ContainerHelper from "../../../helper/ContainerHelper.js";

/**
 * @typedef {AbstractContainerComponentOptions} DynamicContainerComponentOptions
 */
/**
 * @template SCT, SCP
 */
export default class DynamicContainerComponent extends AbstractContainerComponent {
    /**
     * @type {ChildrenShellFinder}
     */
    childrenShellFinder;
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
        const helper = new ContainerHelper(this);
        this.shellsManager = helper.createShellsManager();
        this.childrenShellFinder = helper.createChildrenShellFinder();
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
            this.childrenCollection.closeAndRemoveChildrenByPartName(partName);
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
        this.childrenCollection.closeAndRemoveChildren();
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
            .filter(([key]) => !this.childrenCollection.getChildrenByPartName(key).length)
            .forEach(([key]) => this._createOrUpdateChild(key));
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _createOrUpdateChild(partName) {
        const $shells = this.shellsManager.getOrCreateShell(partName);
        isTrue(!!$shells.length, `$shells is empty for part named ${partName}!`)
        $shells.forEach($el => this._createOrUpdateChildForElem($el))
    }

    /**
     * @param {jQuery<HTMLElement>} $shell
     */
    _createOrUpdateChildForElem($shell) {
        const child = this.childrenCollection.getChildByShell($shell);
        if (child) {
            child.replaceFromParent();
        } else {
            // at this point the item component's id is available as data-GlobalConfig.COMPONENT_ID on $shell
            this.childrenCollection.createComponentForShell($shell);
        }
    }
}
