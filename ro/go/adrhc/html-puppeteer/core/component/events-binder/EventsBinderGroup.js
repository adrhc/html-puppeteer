import EventsBinder from "./EventsBinder.js";

export default class EventsBinderGroup extends EventsBinder {
    /**
     * @type {EventsBinder[]}
     */
    _eventsBinders;

    /**
     * @param {EventsBinder[]} eventsBinders
     */
    set eventsBinders(eventsBinders) {
        this._eventsBinders = eventsBinders;
        super.component && this._eventsBinders.forEach(it => it.component = super.component);
    }

    /**
     * @param {AbstractComponent} component
     */
    set component(component) {
        super.component = component;
        component && this._eventsBinders.forEach(it => it.component = component);
    }

    /**
     * @param {EventsBinder[]} eventsBinders
     * @param {AbstractComponent=} component could be set later
     */
    constructor(eventsBinders, component) {
        super(component);
        this.eventsBinders = eventsBinders;
    }

    /**
     * @param {EventsBinder} eventsBinders
     */
    addEventsBinder(...eventsBinders) {
        this._eventsBinders.push(...eventsBinders);
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        this._eventsBinders.forEach(it => it.attachEventHandlers());
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        this._eventsBinders.reverse().forEach(it => it.detachEventHandlers());
    }
}

/**
 * @param {EventsBinderProviderFn[]|undefined} eventsBinderProviders
 * @param {AbstractComponent=} component
 * @return {EventsBinderGroup}
 */
export function eventsBinderGroupOf(eventsBinderProviders, component) {
    const eventBinders = eventsBinderProviders.map(it => it());
    return eventsBinderProviders?.length ? new EventsBinderGroup(eventBinders, component) : undefined;
}