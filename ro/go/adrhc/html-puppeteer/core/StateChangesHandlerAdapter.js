import StringUtils from "../util/StringUtils.js";

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
     * @param {Object} config
     * @param {ComponentIllustrator=} config.componentIllustrator
     * @param {PartsAllocator=} config.partsAllocator
     * @param {StateChangesHandler[]=} config.extraStateChangesHandlers
     * @param {StateChangesHandler[]=} config.stateChangesHandlers
     * @param {string=} config.partMethodPrefix
     */
    constructor({
                    componentIllustrator,
                    partsAllocator,
                    extraStateChangesHandlers = [],
                    stateChangesHandlers,
                    allChangesMethod = "changeOccurred",
                    allPartChangesMethod = "partChangeOccurred",
                    partMethodPrefix = "part",
                }) {
        this.partMethodPrefix = partMethodPrefix;
        this.allChangesMethod = allChangesMethod;
        this.allPartChangesMethod = allPartChangesMethod;
        this.stateChangesHandlers = stateChangesHandlers ?? [];
        this.stateChangesHandlers.push(componentIllustrator);
        this.stateChangesHandlers.push(partsAllocator);
        this.stateChangesHandlers.push(...extraStateChangesHandlers);
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