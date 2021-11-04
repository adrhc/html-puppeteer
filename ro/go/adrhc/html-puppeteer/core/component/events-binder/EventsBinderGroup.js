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
        this._component && this._eventsBinders.forEach(it => it.component = this._component);
    }

    /**
     * @param {AbstractComponent} component
     */
    set component(component) {
        super.component = component;
        component && this._eventsBinders.forEach(it => it.component = component);
    }

    /**
     * @param {AbstractComponent} component
     * @param {EventsBinder[]} eventsBinders
     */
    constructor(component, eventsBinders) {
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