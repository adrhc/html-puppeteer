import {generateString} from "./Generators.js";
import {removeByIndex} from "../html-puppeteer/util/ArrayUtils.js";
import {eventsBinder} from "../html-puppeteer/helper/events-handling/EventsBinderBuilder.js";
import AbstractContainerEventsBinder
    from "../html-puppeteer/core/component/events-binder/AbstractContainerEventsBinder.js";

export default class Scenario10App extends AbstractContainerEventsBinder {
    /**
     * @type {boolean}
     */
    haveDogs;

    /**
     * @param {AbstractContainerComponent} container
     * @param {boolean=} haveDogs
     */
    constructor(container, {haveDogs} = {}) {
        super(container);
        this.haveDogs = haveDogs;
    }

    /**
     * execute the application
     */
    attachEventHandlers() {
        this._eventsHandlerDetachFn = eventsBinder()
            .whenEvents("click").occurOnBtn("create").do(() => {
                this._generateThenAppend("cats");
                if (this.haveDogs) {
                    this._generateThenAppend("dogs");
                }
            })
            .and()
            .whenEvents("click").occurOnBtn("remove").do(() => {
                this._removeOldestItem("cats");
                if (this.haveDogs) {
                    this._removeOldestItem("dogs");
                }
            })
            .and()
            .buildDetachEventsHandlersFn();
    }

    /**
     * @param {string} partName
     * @protected
     */
    _removeOldestItem(partName) {
        const items = this.container.getPart(partName) ?? [];
        removeByIndex(items, 0);
        this.container.replacePart(partName, items);
    }

    /**
     * @param {string} partName
     * @protected
     */
    _generateThenAppend(partName) {
        const items = this.container.getPart(partName) ?? [];
        items.push(this._generateNewItem(partName));
        this.container.replacePart(partName, items);
    }

    /**
     * @param {OptionalPartName=} partName
     * @return {*}
     * @protected
     */
    _generateNewItem(partName) {
        return {id: Math.random(), name: generateString(`${partName} `)};
    }
}