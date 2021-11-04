import BasicContainerComponent from "./BasicContainerComponent.js";
import {isTrue} from "../../util/AssertionUtils.js";
import ChildrenShellFinder from "../view/ChildrenShellFinder.js";
import {stateIsEmpty} from "../state/StateHolder.js";

/**
 * @typedef {BasicContainerComponentOptions} StaticContainerComponentOptions
 * @property {ChildrenShellFinder=} childrenShellFinder
 * @property {boolean=} ignoreMissingShells
 */
/**
 * @template SCT, SCP
 * @extends {BasicContainerComponent}
 */
export default class StaticContainerComponent extends BasicContainerComponent {
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
        super({...options, ignoreShellTemplateOptions: true});
        this.childrenShellFinder = this.config.childrenShellFinder ?? new ChildrenShellFinder(this.config.elemIdOrJQuery);
        this.ignoreMissingShells = this.config.ignoreMissingShells ?? true;
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
            this.childrenComponents.getChildByPartName(partName).close();
            this._replacePartImpl(previousPartName, newPart, newPartName, dontRecordChanges);
        } else {
            this._replacePartImpl(previousPartName, newPart, newPartName, dontRecordChanges);
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
        this.childrenComponents.createOrUpdateChild($shell);
    }
}