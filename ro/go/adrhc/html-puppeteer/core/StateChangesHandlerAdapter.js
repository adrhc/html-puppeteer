import StringUtils from "../util/StringUtils.js";

export default class StateChangesHandlerAdapter {
    /**
     * @type {string}
     */
    partMethodPrefix;
    /**
     * @type {StateChangesHandler[]}
     */
    stateChangesHandlers = [null, null];

    /**
     * @param {ComponentIllustrator} componentIllustrator
     */
    set componentIllustrator(componentIllustrator) {
        this.stateChangesHandlers[0] = componentIllustrator;
    }

    /**
     * @param {PartsAllocator} partsAllocator
     */
    set partsAllocator(partsAllocator) {
        this.stateChangesHandlers[1] = partsAllocator;
    }

    /**
     * @param {Object} config
     * @param {ComponentIllustrator=} config.componentIllustrator
     * @param {PartsAllocator=} config.partsAllocator
     * @param {StateChangesHandler[]=} config.stateChangesHandlers
     * @param {string=} config.partMethodPrefix
     */
    constructor({componentIllustrator, partsAllocator, stateChangesHandlers, partMethodPrefix = "part"}) {
        this.partMethodPrefix = partMethodPrefix;
        this.componentIllustrator = componentIllustrator;
        this.partsAllocator = partsAllocator;
        if (stateChangesHandlers != null) {
            this.stateChangesHandlers = stateChangesHandlers;
        }
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
    _invokeStateChangesHandler(stateChangesHandler, methodName, typedStateChange,) {
        stateChangesHandler?.[methodName](typedStateChange);
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
        return `${StringUtils.toTitleCase(changeType)}`;
    }

    /**
     * @param {string} changeType
     * @return {string}
     * @protected
     */
    _methodVerbOf(changeType) {
        return `${StringUtils.toCamelCase(changeType)}`;
    }
}