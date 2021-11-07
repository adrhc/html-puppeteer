import {isTrue} from "../../../util/AssertionUtils.js";
import {css} from "../../../helper/CSSSelectorBuilder.js";
import {when} from "../../../helper/events-handling/DomEventsAttachBuilder.js";

export default class EventsBinder {
    /**
     * @type {AbstractComponent}
     */
    _component;

    /**
     * @return {AbstractComponent}
     */
    get component() {
        return this._component;
    }

    /**
     * The corresponding getter won't work in descendent classes!
     *
     * @param {AbstractComponent=} component
     */
    set component(component) {
        this._component = component;
    }

    /**
     * @return {string}
     */
    get componentId() {
        return this._component.id;
    }

    /**
     * @param {AbstractComponent=} component
     */
    constructor(component) {
        this._component = component;
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {}

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {}

    /**
     * Attaches the "eventName" handler (i.e. "fn"), possibly once (see oneTimeOnly),
     * to the elements selected with [data-owner=this.componentId][data-dataAttrName].
     *
     * @param {string} dataAttrName
     * @param {string} eventName
     * @param {function(ev: Event)} fn is the event handler
     * @param {boolean=} oneTimeOnly specify whether to invoke the event once or multiple times
     * @protected
     */
    _attachEventsHandlerToOwnedHavingDataAttr(dataAttrName, eventName, fn, oneTimeOnly) {
        const $el = this._$ownedHavingDataAttr(dataAttrName);
        if (!$el.length) {
            return;
        }
        const event = eventName ?? $el.data(dataAttrName);
        isTrue(!!event, "[OpenCloseEventsBinder] event can't be empty!");
        // removing previous handler (if any) set by another component
        $el.off(event);
        // $el[oneTimeOnly ? "one" : "on"](event, fn);
        when(event).occurOn($el).do(fn);
    }

    /**
     * Detaches the "eventName" handler applied on elements selected with [data-owner=this.componentId][data-dataAttrName].
     *
     * @param {string} dataAttrName
     * @param {string} eventName
     * @protected
     */
    _detachEventsHandlerFromOwnedHavingDataAttr(dataAttrName, eventName) {
        this._$ownedHavingDataAttr(dataAttrName).off(eventName);
    }

    /**
     * @param {string} dataAttrName
     * @return {jQuery<HTMLElement>} the element(s) selected with [data-owner=this.componentId][data-dataAttrName]
     * @protected
     */
    _$ownedHavingDataAttr(dataAttrName) {
        return $(this._ownedHavingDataAttrSelector(dataAttrName));
    }

    /**
     * @param {string} dataAttrName
     * @return {string} the CSS selector [data-owner=this.componentId][data-dataAttrName]
     * @protected
     */
    _ownedHavingDataAttrSelector(dataAttrName) {
        // [data-owner="componentId"][data-dataAttrName]
        // return `${dataOwnerSelectorOf(this._component.id)}${dataSelectorOf(dataAttrName)}`;
        // return css().withOwner(this._component.id).withDataAttributeName(dataAttrName).selector();
        // return css({owner: this._component.id, dataAttrName}).selector();
        return css().owner(this.componentId).dataAttrName(dataAttrName).selector();
    }
}
