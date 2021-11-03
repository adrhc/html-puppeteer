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
     * elements having this._component.id as "owner" and dataAttributeName as a data-attribute name.
     *
     * @param {string} dataAttribName
     * @param {string} eventName
     * @param {function(ev: Event)} fn is the event handler
     * @param {boolean=} oneTimeOnly specify whether to invoke the event once or multiple times
     * @protected
     */
    _attachEventsHandlerToOwnedHavingDataAttr(dataAttribName, eventName, fn, oneTimeOnly) {
        const $el = this._$ownedHavingDataAttr(dataAttribName);
        if (!$el.length) {
            return;
        }
        const event = eventName ?? $el.data(dataAttribName);
        isTrue(!!event, "[OpenCloseEventsBinder] event can't be empty!");
        // removing previous handler (if any) set by another component
        $el.off(event);
        // $el[oneTimeOnly ? "one" : "on"](event, fn);
        whenEvents(event).occurOn($el).use(fn).toHandle();
    }

    /**
     * Detaches the "eventName" handler applied on elements having
     * this._component.id as "owner" and dataAttributeName as a data-attribute name.
     *
     * @param {string} dataAttribName
     * @param {string} eventName
     * @protected
     */
    _detachEventsHandlerFromOwnedHavingDataAttr(dataAttribName, eventName) {
        this._$ownedHavingDataAttr(dataAttribName).off(eventName);
    }

    /**
     * @param {string} dataAttribName
     * @return {jQuery<HTMLElement>} the element(s) having this._component.id as "owner" and dataAttributeName as a data-attribute name
     * @protected
     */
    _$ownedHavingDataAttr(dataAttribName) {
        return $(`${this._ownedHavingDataAttrCssSelector(dataAttribName)}`);
    }

    /**
     * @param {string} dataAttributeName
     * @return {string} a CSS selector referring the elements having this._component.id as "owner" and dataAttributeName as a data-attribute name
     * @protected
     */
    _ownedHavingDataAttrCssSelector(dataAttributeName) {
        // [data-owner="componentId"][data-dataAttributeName]
        // return `${dataOwnerSelectorOf(this._component.id)}${dataSelectorOf(dataAttributeName)}`;
        // return css().withOwner(this._component.id).withDataAttributeName(dataAttributeName).selector();
        // return css({owner: this._component.id, dataAttributeName}).selector();
        return css().owner(this._component.id).dataAttributeName(dataAttributeName).selector();
    }
}
