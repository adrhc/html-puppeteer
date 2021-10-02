import {dataPartSelector, dataPartSelectorOf, dataTypeSelector} from "../../util/SelectorUtils.js";
import {jQueryOf} from "../../util/DomUtils.js";
import {typeOf} from "../../util/GlobalConfig.js";

export default class ChildrenShellFinder {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $containerElem;
    /**
     * @type {boolean}
     */
    containerIsComponent;

    /**
     * @param {string|jQuery<HTMLElement>} elemIdOrJQuery
     */
    constructor(elemIdOrJQuery) {
        this.$containerElem = jQueryOf(elemIdOrJQuery);
        this.containerIsComponent = typeOf(this.$containerElem) != null;
    }

    /**
     * @param {OptionalPartName=} partName
     * @return {jQuery<HTMLElement>[]}
     */
    $childrenShells(partName) {
        if (this.containerIsComponent) {
            return this.$containerElem
                .find(`${partName == null ? dataPartSelector() : dataPartSelectorOf(partName)}`)
                .toArray()
                .map(shell => [shell, $(shell).parents(dataTypeSelector())])
                .filter(([, $parents]) => $parents[0] === this.$containerElem[0])
                .map(([shell]) => $(shell));
        } else {
            return this.$containerElem
                .find(`${partName == null ? dataTypeSelector() : dataPartSelectorOf(partName)}`)
                .toArray()
                .map(shell => [shell, $(shell).parents(dataTypeSelector())])
                .filter(([shell, $parents]) => !$parents.length)
                .map(([shell]) => $(shell));
        }
    }

    /**
     * @param {PartName} partName
     * @return {jQuery<HTMLElement>|undefined}
     */
    $childShellByName(partName) {
        return this.$childrenShells(partName)[0];
    }
}