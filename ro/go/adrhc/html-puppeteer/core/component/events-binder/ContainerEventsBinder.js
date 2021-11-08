import EventsBinder from "./EventsBinder.js";
import {childIdOf} from "../../../util/GlobalConfig.js";
import {dataComponentIdSelectorOf, idAttrSelectorOf} from "../../../util/SelectorUtils.js";
import {uniqueId} from "../../../util/StringUtils.js";
import {when} from "../../../helper/events-handling/DomEventsAttachBuilder.js";

/**
 * @typedef {Object} ContainerEventsBinderOptions
 * @property {string} createEvent
 * @property {string} removeEvent
 * @property {function(component: AbstractContainerComponent): *} childStateProviderFn
 */
export default class ContainerEventsBinder extends EventsBinder {
    /**
     * @type {function(component: AbstractContainerComponent): *}
     * @protected
     */
    childStateProviderFn;
    /**
     * @type {string}
     * @protected
     */
    createDataAttr = "create-child";
    /**
     * @type {string}
     * @protected
     */
    createEvent = "click";
    /**
     * @type {string}
     * @protected
     */
    removeDataAttr = "remove-child";
    /**
     * @type {string}
     * @protected
     */
    removeEvent = "click";

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
        this.createEvent = component.config.createEvent ?? this.createEvent;
        this.removeEvent = component.config.removeEvent ?? this.removeEvent;
        this.childStateProviderFn = component.config.childStateProviderFn ?? (() => {});
    }

    /**
     * @return {AbstractContainerComponent}
     */
    get containerComponent() {
        return /** @type {AbstractContainerComponent} */ this._component;
    }

    /**
     * attaches all necessary DOM event handlers
     */
    attachEventHandlers() {
        // <button data-owner="componentId" data-createDataAttr />
        when(this.createEvent).occurOnOwnedDataAttr(this.createDataAttr, this.componentId).do(() => {
            this.containerComponent.replacePart(uniqueId(), this.childStateProviderFn(this.containerComponent));
        });
        // <div component-id="componentId">
        //     <button data-child-id="childId" data-owner="componentId" data-removeDataAttr />
        // </div>
        when(this.removeEvent).occurOnComponent(this.containerComponent)
            .triggeredByOwnedDataAttr(this.removeDataAttr).do((ev) => {
            const $elem = $(ev.target);
            const childId = childIdOf($elem);
            this.containerComponent.replacePartByChildId(childId);
        });
    }

    /**
     * detaches all DOM event handlers
     */
    detachEventHandlers() {
        this._detachEventsHandlerFromOwnedHavingDataAttr(this.createDataAttr, this.createEvent);
        this._detachEventsHandlerFromOwnedChildrenHavingDataAttr(this.createDataAttr);
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
    _attachEventsHandlerToOwnedChildrenHavingDataAttr(dataAttribName, eventName, fn) {
        const cssSelector = this._ownedHavingDataAttrSelector(dataAttribName);
        // removing previous handler (if any) set by another component
        this.$container.off(eventName, cssSelector);
        this.$container.on(eventName, cssSelector, fn);
    }

    /**
     * Detaches the this.createEvent handler applied on this.$container
     * with the selector [data-owner=this.componentId][data-dataAttrName].
     *
     * @param {string} dataAttribName
     * @protected
     */
    _detachEventsHandlerFromOwnedChildrenHavingDataAttr(dataAttribName) {
        const cssSelector = this._ownedHavingDataAttrSelector(dataAttribName);
        this.$container.off(this.createEvent, cssSelector);
    }
}