/**
 * @template C
 */
class EventsBinderConfigurer {
    /**
     * @type {C}
     */
    component;

    /**
     * @returns {string}
     * @protected
     */
    get _eventsNamespace() {
        return `.${this.constructor.name}.${this.owner}`;
    }

    /**
     * @returns {string}
     * @protected
     */
    get _ownerSelector() {
        return `[data-${JQueryWidgetsConfig.OWNER_ATTRIBUTE}='${this.owner}']`;
    }

    /**
     * @return {string}
     * @protected
     */
    get owner() {
        return this.view.owner;
    }

    /**
     * @return {AbstractView}
     */
    get view() {
        return this.component.view;
    }

    /**
     * @param {C} component
     */
    constructor(component) {
        this.component = component;
    }

    attachEventHandlers() {
        // do nothing
    }

    /**
     * @param events {string,string[]}
     * @return {string}
     * @protected
     */
    _appendNamespaceTo(events) {
        if ($.isArray(events)) {
            return events.map(ev => this._appendNamespaceTo(ev)).join(" ");
        } else {
            return `${events}${this._eventsNamespace}`;
        }
    }

    /**
     * @param btnNames {string[]|string}
     * @param [dontUseOwner] {boolean}
     * @return {string} a selector e.g. [data-owner='personsTable'][data-btn='reload']
     * @protected
     */
    _btnSelector(btnNames, dontUseOwner) {
        if (!$.isArray(btnNames)) {
            btnNames = [btnNames];
        }
        return btnNames.map(name => `${this._ownerSelector}[data-btn='${name}']`).join();
    }
}