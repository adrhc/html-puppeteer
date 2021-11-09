export default class EventsBinder {
    /**
     * @type {EventsHandlerDetachFn}
     * @protected
     */
    _eventsHandlerDetachFn

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
    detachEventHandlers() {
        this._eventsHandlerDetachFn?.();
    }
}
