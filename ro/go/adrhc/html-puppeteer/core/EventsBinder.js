export default class EventsBinder {
    /**
     * @type {AbstractComponent}
     */
    component;

    /**
     * @param {AbstractComponent=} component
     */
    constructor(component) {
        this.component = component;
    }

    attachEventHandlers() {}

    detachEventHandlers() {}
}