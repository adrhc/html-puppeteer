import EventsBinder from "./EventsBinder.js";

export default class AbstractContainerEventsBinder extends EventsBinder {
    /**
     * @return {AbstractContainerComponent}
     */
    get container() {
        return /** @type {AbstractContainerComponent} */ this._component;
    }
}