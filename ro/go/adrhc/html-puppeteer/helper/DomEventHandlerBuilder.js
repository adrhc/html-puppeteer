import {isTrue} from "../util/AssertionUtils.js";
import {btnSelectorOf} from "../util/SelectorUtils.js";

export class DomEventHandlerBuilder {
    /**
     * @type {jQuery<HTMLElement>} is the element to which the event handler is bound to
     * @protected
     */
    $elem;
    /**
     * @type {string} space separated list of events to handle, e.g. "click mouseover"
     * @protected
     */
    events;
    /**
     * @type {function(ev: Event)}
     * @protected
     */
    fn;
    /**
     * @type {boolean} specify whether to handle then forget or keep the events handler bound till manually releasing it
     * @protected
     */
    oneTimeOnly;

    /**
     * @param {string[]} events
     * @return {DomEventHandlerBuilder}
     */
    whenEvents(events) {
        this.events = events.join(" ");
        return this;
    }

    /**
     * @param {string|jQuery<HTMLElement>} $elemOrSelector
     * @return {DomEventHandlerBuilder}
     */
    occurOn($elemOrSelector) {
        this.$elem = typeof $elemOrSelector === "string" ? $($elemOrSelector) : $elemOrSelector;
        return this;
    }

    /**
     * @param {string} name
     * @param {string=} owner
     * @return {DomEventHandlerBuilder}
     */
    occurOnBtn(name, owner) {
        return this.occurOn(btnSelectorOf(name, owner));
    }

    /**
     * @param {function(ev: Event)} fn
     * @return {DomEventHandlerBuilder}
     */
    do(fn) {
        this.fn = fn;
        this.$elem[this.oneTimeOnly ? "one" : "on"](this.events, this.fn);
        return this;
    }

    /**
     * @param {boolean=} [once=true]
     * @return {DomEventHandlerBuilder}
     */
    once(once = true) {
        this.oneTimeOnly = once;
        return this;
    }
}

/**
 * @param {string} events
 * @return {DomEventHandlerBuilder}
 */
export function when(...events) {
    isTrue(!!events?.length, "[DomEventHandlerBuilder] events can't be empty!");
    return new DomEventHandlerBuilder().whenEvents(events);
}