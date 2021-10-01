import {dataPartSelector, dataPartSelectorOf, dataTypeSelector} from "../../util/SelectorUtils.js";
import {jQueryOf} from "../../util/DomUtils.js";

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
     * @param {PartName=} partName
     * @return {jQuery<HTMLElement>[]}
     */
    $childrenShells(partName) {
        return this.$containerElem
            .find(`${partName == null ? dataPartSelector() : dataPartSelectorOf(partName)}`)
            .toArray()
            .map(shell => [shell, $(shell).parents(dataTypeSelector())])
            .filter(([, $parents]) => $parents[0] === this.$containerElem[0])
            .map(([shell]) => $(shell));
    }

    /**
     * @param {PartName} partName
     * @return {jQuery<HTMLElement>|undefined}
     */
    $childShellByName(partName) {
        return this.$childrenShells(partName)[0];
    }
}