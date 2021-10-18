import {pushNotNull} from "../../util/ArrayUtils.js";

/**
 * @typedef {Object} StateChangesHandlersField
 * @property {ComponentIllustrator=} componentIllustrator
 * @property {StateChangesHandler[]=} extraStateChangesHandlers
 */
/**
 * @typedef {StateChangesHandlersField} StateChangesHandlersInvokerOptions
 * @property {string=} handleAllChangesMethodName
 * @property {string=} handleAllPartChangesMethodName
 * @property {string=} partChangeMethodNamePrefix
 * @property {StateChangesHandler[]=} stateChangesHandlers
 */
export default class StateChangesHandlersInvoker {
    /**
     * @type {string}
     */
    handleAllChangesMethodName;
    /**
     * @type {string}
     */
    handleAllPartChangesMethodName;
    /**
     * @type {string}
     */
    partChangeMethodNamePrefix;
    /**
     * @type {StateChangesHandler[]}
     */
    stateChangesHandlers;

    /**
     * @param {StateChangesHandlersInvokerOptions} options
     */
    constructor(options) {
        this.partChangeMethodNamePrefix = options.partChangeMethodNamePrefix ?? "part";
        this.handleAllChangesMethodName = options.handleAllChangesMethodName ?? "changeOccurred";
        this.handleAllPartChangesMethodName = options.handleAllPartChangesMethodName ?? "partChangeOccurred";
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
                                    extraStateChangesHandlers,
                                }) {
        extraStateChangesHandlers = extraStateChangesHandlers ?? [];
        return pushNotNull([], componentIllustrator, ...extraStateChangesHandlers);
    }

    /**
     * @param {StateChangesHandler} stateChangesHandlers
     */
    appendStateChangesHandlers(...stateChangesHandlers) {
        pushNotNull(this.stateChangesHandlers, ...stateChangesHandlers);
    }

    /**
     * @param {StateChangesCollector} stateChangesCollector
     * @return {[]}
     * @return
     */
    processStateChanges(stateChangesCollector) {
        return stateChangesCollector.consumeAll()
            .flatMap(sc => this._processStateChange(sc));
    }

    /**
     * @param {StateChange} typedStateChange
     * @return {[]}
     * @protected
     */
    _processStateChange(typedStateChange) {
        const methodName = this._methodNameOf(typedStateChange);
        return this.stateChangesHandlers
            .flatMap(sch => this._invokeStateChangesHandler(sch, methodName, typedStateChange));
    }

    /**
     * @param {StateChangesHandler} stateChangesHandler
     * @param {string} methodName
     * @param {StateChange} typedStateChange
     * @return {[]}
     * @protected
     */
    _invokeStateChangesHandler(stateChangesHandler, methodName, typedStateChange) {
        const result = [stateChangesHandler?.[methodName]?.(typedStateChange)];
        if (this.handleAllChangesMethodName != null) {
            result.push(stateChangesHandler[this.handleAllChangesMethodName]?.(typedStateChange));
        }
        if (this.handleAllPartChangesMethodName != null && this._isPartialChange(typedStateChange)) {
            result.push(stateChangesHandler[this.handleAllPartChangesMethodName]?.(typedStateChange));
        }
        return result.filter(notEmpty);
    }

    /**
     * @param {StateChange} typedStateChange
     * @return {string}
     * @protected
     */
    _methodNameOf(typedStateChange) {
        if (this._isPartialChange(typedStateChange)) {
            const suffix = this._partMethodVerbOf(typedStateChange.changeType);
            return `${this.partChangeMethodNamePrefix}${suffix}`;
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


/**
 * @param {*} value
 * @return {boolean}
 */
function notEmpty(value) {
    return value != null && (_.isArray(value) && !value.length || value !== {})
}
