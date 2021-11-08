import {isTrue} from "../../util/AssertionUtils.js";
import {btnSelectorOf} from "../../util/SelectorUtils.js";
import {css} from "../CSSSelectorBuilder.js";

/**
 * @typedef {function(ev: Event)} EventsHandler
 */

/**
 * @typedef {function(): void} EventsHandlerDetachFn
 */

/**
 * @typedef {{}} DomEventsAttachParams
 * @property {string} events
 * @property {jQuery<HTMLElement>} $elem
 * @property {string=} trigger
 * @property {EventsHandler=} fn
 * @property {boolean=} once
 */
/**
 * @typedef {function(component: AbstractComponent): jQuery<HTMLElement>} ElemProviderFn
 */
export class DomEventsAttachBuilder {
    /**
     * @type {jQuery<HTMLElement>} is the element to which the event handler is bound to
     * @protected
     */
    $elem;
    /**
     * @type {ElemProviderFn}
     */
    $elemProvider;
    /**
     * @type {AbstractComponent}
     */
    component;
    /**
     * @type {string} space separated list of events to handle, e.g. "click mouseover"
     * @protected
     */
    events;
    /**
     * @type {EventsHandler}
     * @protected
     */
    fn;
    /**
     * @type {boolean} specify whether to handle then forget or keep the events handler bound till manually releasing it
     * @protected
     */
    oneTimeOnly;
    /**
     * @type {string}
     */
    trigger;

    /**
     * @param {string[]} events
     * @return {DomEventsAttachBuilder}
     */
    whenEvents(events) {
        this.events = events.join(" ");
        return this;
    }

    /**
     * This is the element where the events are actually captured;
     * they might actually be triggered by "trigger" elements.
     *
     * @param {string|jQuery<HTMLElement>} $elemOrSelector
     * @return {DomEventsAttachBuilder}
     */
    occurOn($elemOrSelector) {
        this.$elem = typeof $elemOrSelector === "string" ? $($elemOrSelector) : $elemOrSelector;
        return this;
    }

    /**
     * @param {string} name
     * @param {string=} owner
     * @return {DomEventsAttachBuilder}
     */
    occurOnBtn(name, owner) {
        return this.occurOn(btnSelectorOf(name, owner));
    }

    /**
     * @param {AbstractComponent} component
     */
    occurOnComponent(component) {
        this.$elem = component.$elem;
    }

    /**
     * @param {string} dataAttrName
     * @param {AbstractComponent=} owningComponent might be also provided with useComponent()
     */
    occurOnOwnedDataAttr(dataAttrName, owningComponent) {
        this.component = owningComponent;
        this.$elemProvider = (component) =>
            $(css().owner(component?.id ?? owningComponent.id).dataAttrName(dataAttrName).selector());
    }

    /**
     * This is the selector specifying the elements that must actually trigger the events captured at $elem.
     * see https://learn.jquery.com/events/event-delegation/#event-propagation
     *
     * @param {string} selector
     */
    triggeredBy(selector) {
        this.trigger = selector;
    }

    /**
     * @param {AbstractComponent} component
     * @return {DomEventsAttachBuilder}
     */
    useComponent(component) {
        this.component = component;
        return this;
    }

    /**
     * This is not a "builder" method (it build nothing); it merely gathers data for a later building.
     *
     * @param {EventsHandler} fn
     * @return {DomEventsAttachBuilder}
     */
    useHandler(fn) {
        this.fn = fn;
        return this;
    }

    /**
     * @param {boolean=} [once=true]
     * @return {DomEventsAttachBuilder}
     */
    once(once = true) {
        this.oneTimeOnly = once;
        return this;
    }

    /**
     * This is a "builder" method; it actually bind the events handler to the DOM element.
     *
     * @param {EventsHandler=} fn might be already provided by use(fn)
     * and this method to be used to actually attach the events handler
     * @return {DomEventsAttachBuilder}
     */
    do(fn) {
        this.fn = fn ?? this.fn;
        return this.attach();
    }

    /**
     * This is a "builder" method; it actually bind the events handler to the DOM element.
     * Is equivalent to "do" called with a missing "fn" parameter.
     *
     * @return {DomEventsAttachBuilder}
     */
    attach() {
        const params = this._computedParams();
        if (this.trigger) {
            // e.g. $elem.on("click", "tr", doSomethingFn)
            params.$elem[params.once ? "one" : "on"](params.events, params.trigger, params.fn);
        } else {
            // e.g. $elem.on("click", doSomethingFn)
            params.$elem[params.once ? "one" : "on"](params.events, params.fn);
        }
        return this;
    }

    /**
     * @return {EventsHandlerDetachFn}
     */
    buildDetachFn() {
        return detachFnOf(this._computedParams());
    }

    /**
     * @return {DomEventsAttachParams}
     * @protected
     */
    _computedParams() {
        const $elem = this.$elem ?? this.$elemProvider(this.component);
        return {$elem, once: this.oneTimeOnly, events: this.events, trigger: this.trigger, fn: this.fn}
    }
}

/**
 * @param {jQuery<HTMLElement>} $elem
 * @param {string} events
 * @param {EventsHandler} fn
 * @param {string} trigger
 * @return {EventsHandlerDetachFn}
 */
export function detachFnOf({$elem, events, fn, trigger}) {
    if (trigger) {
        return () => $elem.off(events, trigger, fn);
    } else {
        return () => $elem.off(events, fn);
    }
}

/**
 * @param {string} events
 * @return {DomEventsAttachBuilder}
 */
export function when(...events) {
    isTrue(!!events?.length, "[DomEventsAttachBuilder] events can't be empty!");
    return new DomEventsAttachBuilder().whenEvents(events);
}