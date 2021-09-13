import StringUtils from "../util/StringUtils";

export default class StateChangesHandlerAdapter {
    /**
     * @type {string}
     */
    partMethodPrefix = "part"
    /**
     * @type {StateChangesHandler[]}
     */
    stateChangesHandlers = [];

    /**
     * @param {TypedStateChange[]} typedStateChanges
     */
    processStateChanges(typedStateChanges) {
        typedStateChanges.forEach(sc => this._processStateChange(sc))
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
        const handlerMethod = stateChangesHandler[methodName];
        handlerMethod(typedStateChange);
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
        return `${StringUtils.toTitleCase(changeType)}d`;
    }

    /**
     * @param {string} changeType
     * @return {string}
     * @protected
     */
    _methodVerbOf(changeType) {
        return `${changeType.toLowerCase()}d`;
    }
}