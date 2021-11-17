import {jQueryOf} from "../../../util/Utils.js";
import {isTrue} from "../../../util/AssertionUtils.js";

export default class ShellsManager {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $containerElem;
    /**
     * @type {ChildrenShellFinder}
     */
    childrenShellFinder;
    /**
     * specify where to place new kids (append|prepend)
     *
     * @type {string}
     */
    place;
    /**
     * @type {ShellCreator}
     */
    shellCreator;

    /**
     * @param {ChildrenShellFinder} childrenShellFinder
     * @param {ShellCreator} shellCreator
     * @param {ElemIdOrJQuery} elemIdOrJQuery
     * @param {boolean=} newChildrenGoLast
     */
    constructor(childrenShellFinder, shellCreator, elemIdOrJQuery, newChildrenGoLast) {
        this.$containerElem = jQueryOf(elemIdOrJQuery);
        this.place = newChildrenGoLast ? "append" : "prepend";
        this.childrenShellFinder = childrenShellFinder;
        this.shellCreator = shellCreator;
    }

    /**
     * @param {PartName} partName
     * @return {jQuery<HTMLElement>[]}
     */
    getOrCreateShell(partName) {
        const $shell = this.childrenShellFinder.$getChildShellsByPartName(partName);
        if ($shell.length) {
            return $shell;
        }
        isTrue(this.shellCreator.shellTemplate != null,
            `"${partName}" shell is missing from "${this.shellCreator.parentId}"!\n\n"${this.shellCreator.parentId}" content is:\n${this.$containerElem.html()}\n"${this.shellCreator.parentId}" text is:\n${this.$containerElem.text()}`);
        const kidShell = this.shellCreator.createShell(partName);
        this.$containerElem[this.place](kidShell);
        return this.childrenShellFinder.$getChildShellsByPartName(partName);
    }
}