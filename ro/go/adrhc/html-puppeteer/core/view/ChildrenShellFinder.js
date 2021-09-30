import {dataOwnerSelectorOf, dataPartSelectorOf, dataSelectorOf} from "../../util/SelectorUtils.js";
import {isFalse} from "../../util/AssertionUtils.js";
import {jQueryOf} from "../../util/DomUtils.js";
import GlobalConfig from "../../util/GlobalConfig.js";

export default class ChildrenShellFinder {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $containerElem;
    /**
     * it's the child shell template id
     *
     * @type {string}
     */
    parentId;
    /**
     * @type {boolean}
     */
    persistentShells;

    /**
     * @param {string} parentId
     * @param {string|jQuery<HTMLElement>} elemIdOrJQuery
     * @param {boolean=} persistentShells
     */
    constructor(parentId, elemIdOrJQuery, persistentShells) {
        this.parentId = parentId;
        this.$containerElem = jQueryOf(elemIdOrJQuery);
        this.persistentShells = persistentShells;
    }

    /**
     * @return {jQuery<HTMLElement>[]}
     */
    $ownedComponentShells() {
        const ownedComponents = $(`${dataOwnerSelectorOf(this.parentId)}${dataSelectorOf(GlobalConfig.DATA_PART)}`).toArray();
        const children = this.$containerElem.children(`${dataSelectorOf(GlobalConfig.DATA_PART)}`).toArray();
        return _.concat(children, ownedComponents);
    }

    /**
     * @param {string} partName
     * @param {boolean} findMany
     * @return {jQuery<HTMLElement>|undefined}
     */
    $shellElemOf(partName, findMany) {
        let $elem;
        if (this.persistentShells) {
            const $childByPartName = this._$shellByPartName(partName);
            $elem = $childByPartName ? $childByPartName : this._$shellByOwnerAndPartName(partName);
        } else {
            $elem = this._$shellByPartName(partName);
        }
        isFalse(!findMany && $elem?.length > 1, `Found ${$elem?.length} of ${partName}!`);
        return $elem;
    }

    /**
     * @param {string} partName
     * @return {jQuery<HTMLElement>|undefined}
     * @protected
     */
    _$shellByOwnerAndPartName(partName) {
        const byOwnerAndPartNameSelector = `${dataOwnerSelectorOf(this.parentId)}${dataPartSelectorOf(partName)}`
        return this._elemForSelector(byOwnerAndPartNameSelector, "find");
    }

    /**
     * @param {string} partName
     * @return {jQuery<HTMLElement>|undefined}
     * @protected
     */
    _$shellByPartName(partName) {
        const childByPartNameSelector = dataPartSelectorOf(partName);
        return this._elemForSelector(childByPartNameSelector, "children");
    }

    /**
     * @param {string} selector
     * @param {"children" | "find"} searchWith
     * @return {jQuery<HTMLElement>|undefined}
     * @protected
     */
    _elemForSelector(selector, searchWith) {
        const $child = this.$containerElem[searchWith](selector);
        return $child.length ? $child : undefined;
    }
}