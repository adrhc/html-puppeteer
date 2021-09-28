import EventsBinder from "./EventsBinder.js";
import {ownerOf} from "../../../util/GlobalConfig.js";
import {
    dataComponentIdSelectorOf,
    dataOwnerOwnerSelectorOf,
    dataSelectorOf,
    idAttrSelectorOf
} from "../../../util/SelectorUtils.js";
import {idOf} from "../../../util/DomUtils.js";
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
        this.eventName = component.config.guestsRemoveEvent ?? "click";
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
        this._attachEventsHandlerOnOwnedHavingDataAttr("create-guest", () => {
            // <button data-owner="@root.owner" data-create-guest="click">
            this._component.replacePart(uniqueId(), this.initialGuestDetails);
        });
        this._attachChildrenEventsHandlerInsideParent("remove-guest", (ev) => {
            // <button data-owner-owner="parent-component" data-owner="child-id" data-remove-guest="click">
            const $elem = $(ev.target);
            const childId = idOf($elem) ?? ownerOf($elem);
            const guestPartName = (/** @type {ListContainerComponent} */ this._component).getItemById(childId).partName;
            this._component.replacePart(guestPartName);
        });
    }

    /**
     * @param {string} dataAttribName
     * @param {function} fn is the event handler
     * @protected
     */
    _attachChildrenEventsHandlerInsideParent(dataAttribName, fn) {
        // <div data-owner="parent-component-id" data-part="kid0" data-component-id="child-component-id">
        // <button data-owner-owner="parent-component-id" data-owner="child-id" data-remove-guest="click">
        const itemSelector = this._$ownerOwnedHavingDataAttrSelector(dataAttribName);
        // removing previous handler (if any) set by another component
        this.$container.off(this.eventName, itemSelector);
        this.$container.on(this.eventName, itemSelector, fn);
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        this._$ownedHavingDataAttr("create-guest").off(this.eventName);
        $(this._$ownerOwnedHavingDataAttrSelector("remove-guest")).off(this.eventName);
    }

    /**
     * @param {string} dataAttribName
     * @return {string}
     * @protected
     */
    _$ownerOwnedHavingDataAttrSelector(dataAttribName) {
        // [data-owner-owner="parent-component-id"][data-dataAttribName]
        return `${dataOwnerOwnerSelectorOf(this._component.id)}${dataSelectorOf(dataAttribName)}`;
    }
}