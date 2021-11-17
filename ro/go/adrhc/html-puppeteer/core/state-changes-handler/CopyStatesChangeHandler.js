import PartialStateChangesHandler from "./PartialStateChangesHandler.js";

/**
 * @typedef {function(): AbstractComponent} ReceiverComponentFactory
 */
/**
 * @typedef {Object} CopyStatesChangeHandlerOptions
 * @property {ReceiverComponentFactory=} receiverComponentFactory is used to lazy create the receiverComponent
 * @property {AbstractComponent=} receiverComponent
 */
export default class CopyStatesChangeHandler extends PartialStateChangesHandler {
    /**
     * @type {ReceiverComponentFactory}
     */
    receiverComponentFactory;
    /**
     * @type {AbstractComponent}
     */
    _receiverComponent;

    /**
     * @return {AbstractComponent}
     */
    get receiverComponent() {
        this._receiverComponent ??= this.receiverComponentFactory().render();
        return this._receiverComponent;
    }

    /**
     * @param {CopyStatesChangeHandlerOptions} options
     */
    constructor({receiverComponent, receiverComponentFactory}) {
        super();
        this.receiverComponentFactory = receiverComponentFactory;
        this._receiverComponent = receiverComponent;
    }

    /**
     * @param {StateChange} stateChange
     */
    changeOccurred(stateChange) {
        this.receiverComponent.replaceState(stateChange.newState);
    }
}