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
        return $(`${idAttrSelectorOf(this.componentId)}, ${dataComponentIdSelectorOf(this.componentId)}`);
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
     * attaches all necessary DOM event handlers
     */
    attachEventHandlers() {
        this._attachEventsHandlerToOwnedHavingDataAttr("create-child", this.createEvent, () => {
            // <button data-owner="parent-component" data-create-child="click">
            this.containerComponent.replacePart(uniqueId(), this.childStateProviderFn(this.containerComponent));
        });
        this._attachContainerEventsHandlerToOwnedHavingDataAttr("remove-child", this.removeEvent, (ev) => {
            // <button data-owner="parent-component" data-remove-child="click" data-child-id="childId">
            const $elem = $(ev.target);
            const childId = childIdOf($elem);
            this.containerComponent.replacePartByChildId(childId);
        });
    }

    /**
     * Attaches this.createEvent handler (i.e. "fn") to this.$container
     * with the selector [data-owner=this.componentId][data-dataAttrName].
     *
     * @param {string} dataAttribName
     * @param {string} eventName
     * @param {function} fn is the event handler
     * @protected
     */
    _attachContainerEventsHandlerToOwnedHavingDataAttr(dataAttribName, eventName, fn) {
        const cssSelector = this._ownedHavingDataAttrSelector(dataAttribName);
        // removing previous handler (if any) set by another component
        this.$container.off(eventName, cssSelector);
        this.$container.on(eventName, cssSelector, fn);
    }

    /**
     * detaches all DOM event handlers
     */
    detachEventHandlers() {
        this._detachEventsHandlerFromOwnedHavingDataAttr("create-child", this.eventName);
        this._detachContainerEventsHandlerFromOwnedHavingDataAttr("create-child");
    }

    /**
     * Detaches the this.createEvent handler applied on this.$container
     * with the selector [data-owner=this.componentId][data-dataAttrName].
     *
     * @param {string} dataAttribName
     * @protected
     */
    _detachContainerEventsHandlerFromOwnedHavingDataAttr(dataAttribName) {
        const cssSelector = this._ownedHavingDataAttrSelector(dataAttribName);
        this.$container.off(this.createEvent, cssSelector);
    }
}