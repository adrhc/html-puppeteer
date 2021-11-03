import BasicContainerComponent from "./BasicContainerComponent.js";
import {isTrue} from "../../util/AssertionUtils.js";
import ChildrenShellFinder from "../view/ChildrenShellFinder.js";

/**
 * @typedef {BasicContainerComponentOptions} StaticContainerComponentOptions
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
     * @param {ElemIdOrJQuery} elemIdOrJQuery
     * @param {ChildrenShellFinder} childrenShellFinder
     * @param {BasicContainerComponentOptions} restOfOptions
     */
    constructor({elemIdOrJQuery, childrenShellFinder, ...restOfOptions}) {
        super({...restOfOptions, elemIdOrJQuery, childrenShellFinder, ignoreShellTemplateOptions: true});
        this.childrenShellFinder = childrenShellFinder ?? new ChildrenShellFinder(elemIdOrJQuery);
        this.ignoreMissingShells = this.config.ignoreMissingShells ?? true;
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
        this.childrenComponents.createOrUpdateChild(partName, $shell);
    }
}