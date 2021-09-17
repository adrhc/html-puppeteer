import {pushNotNull} from "../util/ArrayUtils.js";

/**
 * @typedef {Object} StateChangesHandlersOptions
 * @property {ComponentIllustrator=} componentIllustrator
 * @property {PartsAllocator=} partsAllocator
 * @property {StateChangesHandler[]=} extraStateChangesHandlers
 */
/**
 * @typedef {StateChangesHandlersOptions} StateChangesHandlerAdapterOptions
 * @property {string=} allChangesMethod
 * @property {string=} allPartChangesMethod
 * @property {string=} partMethodPrefix
 * @property {StateChangesHandler[]=} stateChangesHandlers
 */
export default class StateChangesHandlerAdapter {
    /**
     * @type {string}
     */
    allChangesMethod;
    /**
     * @type {string}
     */
    allPartChangesMethod;
    /**
     * @type {string}
     */
    partMethodPrefix;
    /**
     * @type {StateChangesHandler[]}
     */
    stateChangesHandlers;

    /**
     * @param {StateChangesHandlerAdapterOptions} options
     */
    constructor(options) {
        this.partMethodPrefix = options.partMethodPrefix ?? "part";
        this.allChangesMethod = options.allChangesMethod ?? "changeOccurred";
        this.allPartChangesMethod = options.allPartChangesMethod ?? "partChangeOccurred";
        this.stateChangesHandlers = options.stateChangesHandlers ??
            this._createStateChangesHandlers(options);
    }

    /**
     * @param {StateChangesHandlersOptions} options
     * @return {StateChangesHandler[]}
     * @protected
     */
    _createStateChangesHandlers({
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
     * @param {TypedStateChange} typedStateChange
     * @protected
     */
    _processStateChange(typedStateChange) {
        const methodName = this._methodNameOf(typedStateChange);
        this.stateChangesHandlers.forEach(sch => this._invokeStateChangesHandler(sch, methodName, typedStateChange))
    }

    /**
     * @param {StateChangesHandler} stateChangesHandler
     * @param {string} methodName
     * @param {TypedStateChange} typedStateChange
     * @protected
     */
    _invokeStateChangesHandler(stateChangesHandler, methodName, typedStateChange) {
        stateChangesHandler?.[methodName](typedStateChange);
        if (this.allChangesMethod != null) {
            stateChangesHandler?.[this.allChangesMethod](typedStateChange);
        }
        if (this.allPartChangesMethod != null && this._isPartialChange(typedStateChange)) {
            stateChangesHandler?.[this.allPartChangesMethod](typedStateChange);
        }
    }

    /**
     * @param {TypedStateChange} typedStateChange
     * @return {string}
     * @protected
     */
    _methodNameOf(typedStateChange) {
        if (this._isPartialChange(typedStateChange)) {
            const suffix = this._partMethodVerbOf(typedStateChange.changeType);
            return `${this.partMethodPrefix}${suffix}`;
        } else {
            return this._methodVerbOf(typedStateChange.changeType);
        }
    }

    /**
     * @param {TypedStateChange} typedStateChange
     * @return {boolean}
     * @protected
     */
    _isPartialChange(typedStateChange) {
        return typedStateChange.previousPartName != null || typedStateChange.newPartName;
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

/**
 * @param {StateChangesHandler} stateChangesHandler
 * @return {StateChangesHandlerAdapter}
 */
export function stateCHAOf(stateChangesHandler) {
    return new StateChangesHandlerAdapter({stateChangesHandlers: [stateChangesHandler]})
}