import {isTrue} from "../util/AssertionUtils.js";
import {btnSelectorOf} from "../util/SelectorUtils.js";

export class DomEventsAttachBuilder {
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
     * @return {DomEventsAttachBuilder}
     */
    whenEvents(events) {
        this.events = events.join(" ");
        return this;
    }

    /**
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
     * @param {function(ev: Event)} fn
     * @return {DomEventsAttachBuilder}
     */
    do(fn) {
        this.fn = fn;
        this.$elem[this.oneTimeOnly ? "one" : "on"](this.events, this.fn);
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
}

/**
 * @param {string} events
 * @return {DomEventsAttachBuilder}
 */
export function when(...events) {
    isTrue(!!events?.length, "[DomEventsAttachBuilder] events can't be empty!");
    return new DomEventsAttachBuilder().whenEvents(events);
}