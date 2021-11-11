import {generateString} from "./Generators.js";
import {removeByIndex} from "../html-puppeteer/util/ArrayUtils.js";
import {whenEvents} from "../html-puppeteer/helper/events-handling/DomEventsAttachBuilder.js";

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
        whenEvents("click").occurOnBtn("create").do(() => {
            this._generateThenAppend("cats");
            if (this.haveDogs) {
                this._generateThenAppend("dogs");
            }
        });
        whenEvents("click").occurOnBtn("remove").do(() => {
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