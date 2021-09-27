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

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {}

    /**
     * dettach DOM event handlers
     */
    detachEventHandlers() {}
}