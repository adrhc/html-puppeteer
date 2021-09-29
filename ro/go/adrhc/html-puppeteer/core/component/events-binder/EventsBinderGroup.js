import EventsBinder from "./EventsBinder.js";

export default class EventsBinderGroup extends EventsBinder {
    /**
     * @type {EventsBinder[]}
     */
    eventsBinders;

    /**
     * @param {AbstractComponent} component
     */
    set component(component) {
        super.component = component;
        this.eventsBinders.forEach(it => it.component = component);
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
        this.eventsBinders.push(...eventsBinders);
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        this.eventsBinders.forEach(it => it.attachEventHandlers());
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        this.eventsBinders.reverse().forEach(it => it.detachEventHandlers());
    }
}