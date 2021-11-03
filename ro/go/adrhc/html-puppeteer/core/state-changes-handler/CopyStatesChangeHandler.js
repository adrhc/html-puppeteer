import PartialStateChangesHandler from "./PartialStateChangesHandler.js";

/**
 * @typedef {function(): AbstractComponent} ReceiverComponentFactory
 */
/**
 * @typedef {Object} CopyStatesChangeHandlerOptions
 * @property {ReceiverComponentFactory=} receiverComponentFn is used to lazy create the receiverComponent
 * @property {AbstractComponent=} receiverComponent
 */
export default class CopyStatesChangeHandler extends PartialStateChangesHandler {
    /**
     * @type {ReceiverComponentFactory}
     */
    receiverComponentFn;

    /**
     * @type {AbstractComponent}
     */
    _receiverComponent;

    /**
     * @return {AbstractComponent}
     */
    get receiverComponent() {
        return this._receiverComponent ?? this.receiverComponentFn().render();
    }

    /**
     * @param {CopyStatesChangeHandlerOptions} options
     */
    constructor({receiverComponent, receiverComponentFn}) {
        super();
        this.receiverComponentFn = receiverComponentFn;
        this._receiverComponent = receiverComponent;
    }

    /**
     * @param {StateChange} stateChange
     */
    changeOccurred(stateChange) {
        this.receiverComponent.replaceState(stateChange.newState);
    }
}