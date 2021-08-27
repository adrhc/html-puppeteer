/**
 * @template T, P
 */
class StateHolder {
    /**
     * @param {{initialState: undefined|T, stateChangeMapper: undefined|IdentityStateChangeMapper<T|P>, changesCollector: undefined|StateChangesCollector<T|P>=}} options
     */
    constructor({initialState, stateChangeMapper, changesCollector}) {
        this._currentState = initialState;
        this._stateChanges = changesCollector ?? new StateChangesCollector(
            stateChangeMapper ?? new IdentityStateChangeMapper());
    }

    /**
     * @param {T|P} [stateOrPart]
     * @param {string|number} [partName] specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange<T|P>|boolean} the newly created StateChange or, if dontRecordStateEvents = true, whether a state change occurred
     */
    replace(stateOrPart, {partName, dontRecordStateEvents} = {}) {
        if (partName) {
            return this.replacePart(stateOrPart, partName, dontRecordStateEvents);
        } else {
            return this.replaceEntirely(stateOrPart, {dontRecordStateEvents});
        }
    }

    /**
     * @param {T} [state] is the new state value to store
     * @param {boolean} [dontRecordStateEvents]
     * @param {boolean} [forceUpdate]
     * @return {StateChange<T>|boolean} the newly created StateChange or, if dontRecordStateEvents = true, whether a state change occurred
     */
    replaceEntirely(state, {dontRecordStateEvents, forceUpdate} = {}) {
        if (!forceUpdate && this._currentStateEquals(state)) {
            return false;
        }

        const previousState = this._replaceImpl(state);

        if (dontRecordStateEvents) {
            return true;
        }

        const stateChange = new StateChange(previousState, state);
        return this.collectStateChange(stateChange);
    }

    /**
     * Partially changes the state (aka creates/deletes/replaces a state part/portion/section).
     *
     * @param {P} partialState
     * @param {string|number} dueToChangePartName specify the state's part/section to change/manipulate
     * @param {boolean=} dontRecordStateEvents
     * @return {StateChange<P>|boolean} the newly created StateChange or, if dontRecordStateEvents = true, whether a state change occurred
     */
    replacePart(partialState, dueToChangePartName, dontRecordStateEvents) {
        if (this._areStatePartsEqual(partialState, dueToChangePartName)) {
            return false;
        }

        const previousStatePart = this._replacePartImpl(partialState, dueToChangePartName);

        if (dontRecordStateEvents) {
            return true;
        }

        const stateChange = this._stateChangeOf(previousStatePart, partialState, dueToChangePartName);
        return this.collectStateChange(stateChange);
    }

    /**
     * @param {T} [state] is the new state value to store
     * @return {T} previous state
     * @protected
     */
    _replaceImpl(state) {
        const previousState = this._currentState;
        this._currentState = state;
        return previousState;
    }

    /**
     * @param {P=} previousStatePart
     * @param {P=} partialState
     * @param {string|number=} dueToChangePartName
     * @return {StateChange<P>|undefined}
     * @protected
     */
    _stateChangeOf(previousStatePart, partialState, dueToChangePartName) {
        return new StateChange(previousStatePart, partialState, dueToChangePartName)
    }

    /**
     * @param {P} partialState
     * @param {string|number} dueToChangePartName specify the state's part/section to change/manipulate
     * @return {P} previous state part
     * @protected
     */
    _replacePartImpl(partialState, dueToChangePartName) {
        console.debug(`${this.constructor.name}._replacePartImpl, ${dueToChangePartName}, new part:\n${JSON.stringify(partialState)}`);
        if (dueToChangePartName == null) {
            return undefined;
        }
        const previousStatePart = this.getStatePart(dueToChangePartName);
        this._currentState[dueToChangePartName] = partialState;
        return previousStatePart;
    }

    /**
     * @param [anotherState]
     * @return {boolean}
     * @protected
     */
    _currentStateEquals(anotherState) {
        return this._currentState == null && anotherState == null || this._currentState === anotherState;
    }

    /**
     * @param {P} part
     * @param {string|number} dueToChangePartName specify the state's part/section to change/manipulate
     * @return {boolean}
     * @protected
     */
    _areStatePartsEqual(part, dueToChangePartName) {
        return this.getStatePart(dueToChangePartName) === part;
    }

    /**
     * @param {string|number} [partName] specify the state's part/section to get
     * @return {P}
     */
    getStatePart(partName) {
        if (this._currentState == null || partName == null) {
            return undefined;
        }
        return this._currentState[partName];
    }

    /**
     * @return {StateChange<T|P>|undefined}
     */
    collectStateChange(stateChange) {
        return this._stateChanges.collect(stateChange);
    }

    reset() {
        this._stateChanges.reset();
        this._currentState = undefined;
    }

    /**
     * @type {StateChangesCollector<T|P>}
     * @protected
     */
    _stateChanges;

    /**
     * @return {StateChangesCollector<T|P>}
     */
    get stateChanges() {
        return this._stateChanges;
    }

    /**
     * @type {T}
     * @protected
     */
    _currentState;

    /**
     * @return {T}
     */
    get currentState() {
        return this._currentState;
    }

    /**
     * @param {T} currentState
     */
    set currentState(currentState) {
        this._currentState = currentState;
    }
}