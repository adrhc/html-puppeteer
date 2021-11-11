import {btnSelectorOf} from "../html-puppeteer/util/SelectorUtils.js";
import {generateString} from "./Generators.js";
import {removeByIndex} from "../html-puppeteer/util/ArrayUtils.js";

export default class Scenario10App {
    /**
     * @type {boolean}
     */
    haveDogs;
    /**
     * @type {AbstractContainerComponent}
     */
    parent;

    /**
     * @param {AbstractContainerComponent} parent
     * @param {boolean=} haveDogs
     */
    constructor(parent, {haveDogs} = {}) {
        this.parent = parent;
        this.haveDogs = haveDogs;
    }

    /**
     * execute the application
     */
    run() {
        $(btnSelectorOf("create")).on("click", () => {
            this._generateThenAppend("cats");
            if (this.haveDogs) {
                this._generateThenAppend("dogs");
            }
        });
        $(btnSelectorOf("remove")).on("click", () => {
            this._removeOldestItem("cats");
            if (this.haveDogs) {
                this._removeOldestItem("dogs");
            }
        });
    }

    /**
     * @param {string} partName
     * @protected
     */
    _removeOldestItem(partName) {
        const items = this.parent.getPart(partName) ?? [];
        removeByIndex(items, 0);
        this.parent.replacePart(partName, items);
    }

    /**
     * @param {string} partName
     * @protected
     */
    _generateThenAppend(partName) {
        const items = this.parent.getPart(partName) ?? [];
        items.push(this._generateNewItem(partName));
        this.parent.replacePart(partName, items);
    }

    /**
     * @param {OptionalPartName=} partName
     * @return {*}
     * @protected
     */
    _generateNewItem(partName) {
        return {id: Math.random(), name: generateString("name ")};
    }
}