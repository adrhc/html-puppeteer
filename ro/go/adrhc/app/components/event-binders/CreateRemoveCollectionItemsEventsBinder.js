import {removeByIndex} from "../../../html-puppeteer/util/ArrayUtils.js";
import {generateString} from "../../Generators.js";
import AbstractContainerEventsBinder
    from "../../../html-puppeteer/core/component/events-binder/AbstractContainerEventsBinder.js";
import {eventsBinder} from "../../../html-puppeteer/helper/events-handling/EventsBinderBuilder.js";

export default class CreateRemoveCollectionItemsEventsBinder extends AbstractContainerEventsBinder {
    /**
     * @type {string}
     */
    collectionPartName;

    /**
     * @param {AbstractComponent} component
     * @param {string} collectionPartName
     */
    constructor(component, collectionPartName) {
        super(component);
        this.collectionPartName = collectionPartName;
    }

    /**
     * execute the application
     */
    attachEventHandlers() {
        this._eventsHandlerDetachFn = eventsBinder()
            .whenEvents("click").occurOnBtn("create").do(() => this._onClickCreate())
            .and()
            .whenEvents("click").occurOnBtn("remove").do(() => this._onClickRemove())
            .and()
            .buildDetachEventsHandlersFn();
    }

    /**
     * @protected
     */
    _onClickCreate() {
        this._generateThenAppend(this.collectionPartName);
    }

    /**
     * @protected
     */
    _onClickRemove() {
        this._removeOldestItem(this.collectionPartName);
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