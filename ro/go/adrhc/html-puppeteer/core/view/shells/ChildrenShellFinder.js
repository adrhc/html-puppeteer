import {dataPartSelectorOf, dataTypeSelector} from "../../../util/SelectorUtils.js";
import {jQueryOf} from "../../../util/Utils.js";
import {typeOf} from "../../../util/GlobalConfig.js";

/**
 * Dealing with shell queries.
 */
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
     * @param {ElemIdOrJQuery} elemIdOrJQuery
     */
    constructor(elemIdOrJQuery) {
        this.$containerElem = jQueryOf(elemIdOrJQuery);
        this.containerIsComponent = typeOf(this.$containerElem) != null;
    }

    /**
     * @return {jQuery<HTMLElement>[]}
     */
    $getAllChildrenShells() {
        return this.$getChildShellsByPartName();
    }

    /**
     * @param {OptionalPartName=} partName
     * @return {jQuery<HTMLElement>[]}
     */
    $getChildShellsByPartName(partName) {
        if (this.containerIsComponent) {
            return this._$getContainerChildrenShells(partName);
        } else {
            return this._$getLevel1ShellsInContainerElem(partName);
        }
    }

    /**
     * @param {OptionalPartName=} partName
     * @return {jQuery<HTMLElement>[]}
     * @protected
     */
    _$getLevel1ShellsInContainerElem(partName) {
        return this.$containerElem
            .find(`${partName == null ? dataTypeSelector() : dataPartSelectorOf(partName)}`)
            .toArray()
            .map(shell => [shell, $(shell).parents(dataTypeSelector())])
            .filter(([, $parents]) => !$parents.length)
            .map(([shell]) => $(shell));
    }

    /**
     * @param {OptionalPartName=} partName
     * @return {jQuery<HTMLElement>[]}
     * @protected
     */
    _$getContainerChildrenShells(partName) {
        return this.$containerElem
            // one could use dataPartSelector() instead of dataTypeSelector() because a child
            // component is supposed to have "data-part" set; for switcher though "data-part"
            // will most likely miss, being replaced by "data-active-name" hence is better to
            // use dataTypeSelector() here
            .find(`${partName == null ? dataTypeSelector() : dataPartSelectorOf(partName)}`)
            .toArray()
            .map(shell => [shell, $(shell).parents(dataTypeSelector())])
            .filter(([, $parents]) => $parents[0] === this.$containerElem[0])
            .map(([shell]) => $(shell));
    }
}