import EventsBinder from "./EventsBinder.js";
import {childIdOf} from "../../../util/GlobalConfig.js";
import {dataComponentIdSelectorOf, idAttrSelectorOf} from "../../../util/SelectorUtils.js";
import {uniqueId} from "../../../util/StringUtils.js";

/**
 * @typedef {Object} ContainerEventsBinderOptions
 * @property {string} createEvent
 * @property {string} removeEvent
 * @property {function(component: BasicContainerComponent): *} childStateProviderFn
 */
export default class ContainerEventsBinder extends EventsBinder {
    /**
     * @type {function(component: BasicContainerComponent): *}
     */
    childStateProviderFn;
    /**
     * @type {string}
     */
    createEvent;
    /**
     * @type {string}
     */
    removeEvent;

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
        this.createEvent = component.config.createEvent ?? "click";
        this.removeEvent = component.config.removeEvent ?? "click";
        this.childStateProviderFn = component.config.childStateProviderFn ?? (() => {});
    }

    /**
     * @return {BasicContainerComponent}
     */
    get containerComponent() {
        return /** @type {BasicContainerComponent} */ this._component;
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        this._attachEventsHandlerOnOwnedHavingDataAttr("create-child", this.createEvent, () => {
            // <button data-owner="parent-component" data-create-child="click">
            this.containerComponent.replacePart(uniqueId(), this.childStateProviderFn(this.containerComponent));
        });
        this._attachEventsHandlerOnOwnedHavingDataAttrInsideParent("remove-child", this.removeEvent, (ev) => {
            // <button data-owner="parent-component" data-remove-child="click" data-child-id="childId">
            const $elem = $(ev.target);
            const childId = childIdOf($elem);
            this.containerComponent.replacePartByChildId(childId);
        });
    }

    /**
     * @param {string} dataAttribName
     * @param {string} eventName
     * @param {function} fn is the event handler
     * @protected
     */
    _attachEventsHandlerOnOwnedHavingDataAttrInsideParent(dataAttribName, eventName, fn) {
        const itemSelector = this._$ownedHavingDataAttrSelector(dataAttribName);
        // removing previous handler (if any) set by another component
        this.$container.off(eventName, itemSelector);
        this.$container.on(eventName, itemSelector, fn);
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
        this.$container.off(this.createEvent, itemSelector);
    }
}