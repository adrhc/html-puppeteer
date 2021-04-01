/**
 * @template T, P
 */
class StateHolder {
    /**
     * @type {StateChangesCollector<T|P>}
     * @protected
     */
    _stateChanges;
    /**
     * @type {T}
     * @protected
     */
    _currentState;

    /**
     * @param {T} [initialState]
     * @param {IdentityStateChangeMapper<T|P>} [stateChangeMapper]
     * @param {StateChangesCollector<T|P>} [changesCollector]
     */
    constructor({
                    initialState,
                    stateChangeMapper = new IdentityStateChangeMapper(),
                    changesCollector = new StateChangesCollector(stateChangeMapper)
                }) {
        this._currentState = initialState;
        this._stateChanges = changesCollector;
    }

    /**
     * @param {T|P} [stateOrPart]
     * @param {string|number} [partName] specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange<T|P>|undefined}
     */
    replace(stateOrPart, {partName, dontRecordStateEvents} = {}) {
        if (partName) {
            return this.replacePart(stateOrPart, partName, dontRecordStateEvents);
        } else {
            return this.replaceEntirely(stateOrPart, dontRecordStateEvents);
        }
    }

    /**
     * @param {T} [state] is the new state value to store
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange<T>|undefined}
     */
    replaceEntirely(state, dontRecordStateEvents) {
        if (this._currentStateEquals(state)) {
            return undefined;
        }

        const previousState = this._replaceImpl(state);

        if (dontRecordStateEvents) {
            return undefined;
        }

        const stateChange = new StateChange(previousState, state);
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
     * Partially changes the state (aka creates/deletes/replaces a state part/portion/section).
     *
     * @param {P} partialState
     * @param {string|number} partName specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange<P>|undefined}
     */
    replacePart(partialState, partName, dontRecordStateEvents) {
        if (this._currentStatePartEquals(partialState, partName)) {
            return undefined;
        }

        const previousStatePart = this._replacePartImpl(partialState, partName);

        if (dontRecordStateEvents) {
            return undefined;
        }

        const stateChange = new StateChange(previousStatePart, partialState, partName);
        return this.collectStateChange(stateChange);
    }

    /**
     * @param {P} partialState
     * @param {string|number} partName specify the state's part/section to change/manipulate
     * @return {P} previous state part
     * @protected
     */
    _replacePartImpl(partialState, partName) {
        console.debug(`${this.constructor.name}._replacePartImpl, ${partName}, new part:\n${JSON.stringify(partialState)}`);
        const previousStatePart = this.getStatePart(partName);
        this._currentState[partName] = partialState;
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
     * @param {string|number} partName specify the state's part/section to change/manipulate
     * @return {boolean}
     * @protected
     */
    _currentStatePartEquals(part, partName) {
        return this.getStatePart(partName) === part;
    }

    /**
     * @param {string|number} [partName] specify the state's part/section to get
     * @return {P}
     */
    getStatePart(partName) {
        if (this._currentState == null) {
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

    /**
     * @return {StateChangesCollector<T|P>}
     */
    get stateChanges() {
        return this._stateChanges;
    }

    reset() {
        this._stateChanges.reset();
        this._currentState = undefined;
    }
}