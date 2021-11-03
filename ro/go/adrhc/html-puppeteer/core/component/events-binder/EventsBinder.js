import {isTrue} from "../../../util/AssertionUtils.js";
import {css} from "../../../helper/CSSSelectorBuilder.js";
import {whenEvents} from "../../../helper/DomEventHandlerBuilder.js";

export default class EventsBinder {
    /**
     * @type {AbstractComponent}
     */
    _component;

    /**
     * The corresponding getter won't work in descendent classes!
     *
     * @param {AbstractComponent=} component
     */
    set component(component) {
        this._component = component;
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
     * Attaches the "eventName" handler (i.e. "fn"), possibly once (see oneTimeOnly), to the
     * elements having this._component.id as "owner" and dataAttrName as a data-attribute name.
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
        whenEvents(event).occurOn($el).use(fn).toHandle();
    }

    /**
     * Detaches the "eventName" handler applied on elements having
     * this._component.id as "owner" and dataAttrName as a data-attribute name.
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
     * @return {jQuery<HTMLElement>} the element(s) having this._component.id as "owner" and dataAttrName as a data-attribute name
     * @protected
     */
    _$ownedHavingDataAttr(dataAttrName) {
        return $(`${this._ownedHavingDataAttrCssSelector(dataAttrName)}`);
    }

    /**
     * @param {string} dataAttrName
     * @return {string} a CSS selector referring the elements having this._component.id as "owner" and dataAttrName as a data-attribute name
     * @protected
     */
    _ownedHavingDataAttrCssSelector(dataAttrName) {
        // [data-owner="componentId"][data-dataAttrName]
        // return `${dataOwnerSelectorOf(this._component.id)}${dataSelectorOf(dataAttrName)}`;
        // return css().withOwner(this._component.id).withDataAttributeName(dataAttrName).selector();
        // return css({owner: this._component.id, dataAttrName}).selector();
        return css().owner(this._component.id).dataAttrName(dataAttrName).selector();
    }
}
