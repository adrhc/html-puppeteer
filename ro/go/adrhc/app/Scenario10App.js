import {namedBtn} from "../html-puppeteer/util/SelectorUtils.js";
import {generateString} from "./Generators.js";
import {removeByIndex, updateOrInsert} from "../html-puppeteer/util/ArrayUtils.js";

export default class Scenario10App {
    /**
     * @type {boolean}
     */
    haveDogs;
    /**
     * @type {SimpleContainerComponent}
     */
    parent;

    /**
     * @param {SimpleContainerComponent} parent
     * @param {boolean=} haveDogs
     */
    constructor(parent, haveDogs) {
        this.parent = parent;
        this.haveDogs = haveDogs;
    }

    /**
     * execute the application
     */
    run() {
        this._createParentStateChangingButtons();
        $(namedBtn("create")).on("click", () => {
            this._createOneAtIndex0("cats");
            if (this.haveDogs) {
                this._createOneAtIndex0("dogs");
            }
        });
        $(namedBtn("remove")).on("click", () => {
            this._removeLast("cats");
            if (this.haveDogs) {
                this._removeLast("dogs");
            }
        });
    }

    /**
     * @protected
     */
    _createParentStateChangingButtons() {
        $(namedBtn("change-parent-state")).on("click",
            () => {
                this.parent.replaceState(JSON.parse($("#main-debugger").val()));
            });
        $(namedBtn("change-partial-state")).on("click", () => {
            const guestsState = JSON.parse($("#partial-state").val());
            this.parent.replaceParts(guestsState);
        });
    }

    /**
     * @param {string} partName
     * @protected
     */
    _removeLast(partName) {
        const items = this.parent.getPart(partName) ?? [];
        removeByIndex(items, items.length - 1);
        this.parent.replacePart(partName, items);
    }

    /**
     * @param {string} partName
     * @protected
     */
    _createOneAtIndex0(partName) {
        const items = this.parent.getPart(partName) ?? [];
        updateOrInsert(items, {id: Math.random(), name: generateString("name ")});
        this.parent.replacePart(partName, items);
    }
}