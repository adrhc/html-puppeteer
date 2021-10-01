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
     * @param {string} parentId
     * @param {string|jQuery<HTMLElement>} elemIdOrJQuery
     */
    constructor(parentId, elemIdOrJQuery) {
        this.parentId = parentId;
        this.$containerElem = jQueryOf(elemIdOrJQuery);
    }

    /**
     * @param {OptionalPartName=} partName
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