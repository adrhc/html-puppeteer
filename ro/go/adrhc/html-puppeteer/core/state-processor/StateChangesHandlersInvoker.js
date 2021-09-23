import {pushNotNull} from "../../util/ArrayUtils.js";

/**
 * @typedef {Object} StateChangesHandlersField
 * @property {ComponentIllustrator=} componentIllustrator
 * @property {PartsAllocator=} partsAllocator
 * @property {StateChangesHandler[]=} extraStateChangesHandlers
 */
/**
 * @typedef {StateChangesHandlersField} StateChangesHandlersInvokerOptions
 * @property {string=} captureAllChangesMethod
 * @property {string=} captureAllPartChangesMethod
 * @property {string=} partChangeMethodPrefix
 * @property {StateChangesHandler[]=} stateChangesHandlers
 */
export default class StateChangesHandlersInvoker {
    /**
     * @type {string}
     */
    captureAllChangesMethod;
    /**
     * @type {string}
     */
    captureAllPartChangesMethod;
    /**
     * @type {string}
     */
    partChangeMethodPrefix;
    /**
     * @type {StateChangesHandler[]}
     */
    stateChangesHandlers;

    /**
     * @param {StateChangesHandlersInvokerOptions} options
     */
    constructor(options) {
        this.partChangeMethodPrefix = options.partChangeMethodPrefix ?? "part";
        this.captureAllChangesMethod = options.captureAllChangesMethod ?? "changeOccurred";
        this.captureAllPartChangesMethod = options.captureAllPartChangesMethod ?? "partChangeOccurred";
        this.stateChangesHandlers = options.stateChangesHandlers ??
            this._createStateChangesInvokers(options);
    }

    /**
     * @param {StateChangesHandlersField} options
     * @return {StateChangesHandler[]}
     * @protected
     */
    _createStateChangesInvokers({
                                    componentIllustrator,
                                    partsAllocator,
                                    extraStateChangesHandlers,
                                }) {
        extraStateChangesHandlers = extraStateChangesHandlers ?? [];
        return pushNotNull([], componentIllustrator, partsAllocator, ...extraStateChangesHandlers);
    }

    /**
     * @param {StateChangesHandler} stateChangesHandler
     */
    appendStateChangesHandlers(...stateChangesHandler) {
        stateChangesHandler?.forEach(sch => pushNotNull(this.stateChangesHandlers, sch));
    }

    /**
     * @param {StateChangesCollector} stateChangesCollector
     */
    processStateChanges(stateChangesCollector) {
        stateChangesCollector.consumeAll().forEach(sc => this._processStateChange(sc))
    }

    /**
     * @param {StateChange} typedStateChange
     * @protected
     */
    _processStateChange(typedStateChange) {
        const methodName = this._methodNameOf(typedStateChange);
        this.stateChangesHandlers.forEach(sch => this._invokeStateChangesHandler(sch, methodName, typedStateChange))
    }

    /**
     * @param {StateChangesHandler} stateChangesHandler
     * @param {string} methodName
     * @param {StateChange} typedStateChange
     * @protected
     */
    _invokeStateChangesHandler(stateChangesHandler, methodName, typedStateChange) {
        stateChangesHandler?.[methodName]?.(typedStateChange);
        if (this.captureAllChangesMethod != null) {
            stateChangesHandler[this.captureAllChangesMethod]?.(typedStateChange);
        }
        if (this.captureAllPartChangesMethod != null && this._isPartialChange(typedStateChange)) {
            stateChangesHandler[this.captureAllPartChangesMethod]?.(typedStateChange);
        }
    }

    /**
     * @param {StateChange} typedStateChange
     * @return {string}
     * @protected
     */
    _methodNameOf(typedStateChange) {
        if (this._isPartialChange(typedStateChange)) {
            const suffix = this._partMethodVerbOf(typedStateChange.changeType);
            return `${this.partChangeMethodPrefix}${suffix}`;
        } else {
            return this._methodVerbOf(typedStateChange.changeType);
        }
    }

    /**
     * @param {StateChange|PartStateChange} typedStateChange
     * @return {boolean}
     * @protected
     */
    _isPartialChange(typedStateChange) {
        return typedStateChange.previousPartName != null || typedStateChange.newPartName != null;
    }

    /**
     * @param {string} changeType
     * @return {string}
     * @protected
     */
    _partMethodVerbOf(changeType) {
        return _.startCase(changeType);
    }

    /**
     * @param {string} changeType
     * @return {string}
     * @protected
     */
    _methodVerbOf(changeType) {
        return _.camelCase(changeType);
    }
}
