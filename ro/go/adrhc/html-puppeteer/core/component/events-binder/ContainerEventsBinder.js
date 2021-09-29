import EventsBinder from "./EventsBinder.js";
import {childIdOf} from "../../../util/GlobalConfig.js";
import {dataComponentIdSelectorOf, idAttrSelectorOf} from "../../../util/SelectorUtils.js";
import {uniqueId} from "../../../util/StringUtils.js";

export default class ContainerEventsBinder extends EventsBinder {
    /**
     * Default event to bind to on children (for creating/removing a child component).
     *
     * @type {string}
     */
    eventName;

    /**
     * @return {jQuery<HTMLElement>}
     * @protected
     */
    get $container() {
        const parentId = this._component.id;
        return $(`${idAttrSelectorOf(parentId)}, ${dataComponentIdSelectorOf(parentId)}`);
    }

    /**
     * @param {AbstractComponent=} component
     */
    set component(component) {
        this._component = component;
        this.eventName = component.config.childEvent ?? "click";
    }

    /**
     * @return {*} initial part state for the a new child
     */
    get initialGuestDetails() {
        return this._component.config.itemProviderFn?.(this._component) ?? {};
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        this._attachEventsHandlerOnOwnedHavingDataAttr("create-child", () => {
            // <button data-owner="parent-component" data-create-child="click">
            this._component.replacePart(uniqueId(), this.initialGuestDetails);
        });
        this._attachEventsHandlerOnOwnedHavingDataAttrInsideParent("remove-child", (ev) => {
            // <button data-owner="parent-component" data-remove-child="click" data-child-id="childId">
            const $elem = $(ev.target);
            const childId = childIdOf($elem);
            const guestPartName = (/** @type {SimpleContainerComponent} */ this._component).getItemById(childId).partName;
            this._component.replacePart(guestPartName);
        });
    }

    /**
     * @param {string} dataAttribName
     * @param {function} fn is the event handler
     * @protected
     */
    _attachEventsHandlerOnOwnedHavingDataAttrInsideParent(dataAttribName, fn) {
        const itemSelector = this._$ownedHavingDataAttrSelector(dataAttribName);
        // removing previous handler (if any) set by another component
        this.$container.off(this.eventName, itemSelector);
        this.$container.on(this.eventName, itemSelector, fn);
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        this._detachEventsHandlerOnOwnedHavingDataAttr("create-child", this.eventName);
        this._detachEventsHandlerOnOwnedHavingDataAttrInsideParent("create-child");
    }

    /**
     * @param {string} dataAttribName
     * @protected
     */
    _detachEventsHandlerOnOwnedHavingDataAttrInsideParent(dataAttribName) {
        const itemSelector = this._$ownedHavingDataAttrSelector(dataAttribName);
        this.$container.off(this.eventName, itemSelector);
    }
}