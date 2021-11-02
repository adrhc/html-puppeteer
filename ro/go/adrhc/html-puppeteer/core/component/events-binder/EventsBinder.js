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
     * @param {string} dataAttribName
     * @param {string} eventName
     * @param {function} fn is the event handler
     * @param {boolean=} oneTimeOnly specify whether to invoke the event once or multiple times
     * @protected
     */
    _attachEventsHandlerOnOwnedHavingDataAttr(dataAttribName, eventName, fn, oneTimeOnly) {
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
     * @param {string} dataAttribName
     * @param {string} eventName
     * @protected
     */
    _detachEventsHandlerOnOwnedHavingDataAttr(dataAttribName, eventName) {
        this._$ownedHavingDataAttr(dataAttribName).off(eventName);
    }

    /**
     * @param {string} dataAttribName
     * @return {jQuery<HTMLElement>}
     * @protected
     */
    _$ownedHavingDataAttr(dataAttribName) {
        return $(`${this._ownedHavingDataAttrCssSelector(dataAttribName)}`);
    }

    /**
     * @param {string} dataAttributeName
     * @return {string}
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
